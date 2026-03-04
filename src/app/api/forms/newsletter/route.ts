import { NextResponse } from 'next/server';
import {
  getDefaultAdminRecipients,
  getEmailConfig,
  sendTransactionalEmail
} from '@/lib/email/sendgrid';
import { initServerDebugHandlers, withApiDebug } from '@/lib/debug';
import { upsertToMarketingListIfConfigured } from '@/lib/email/sendgridMarketing';
import { backupSubmissionToGoogleSheets } from '@/lib/forms/googleSheetsBackup';
import { renderEmailLayout, renderKeyValueTable } from '@/lib/email/template';

export const runtime = 'nodejs';

initServerDebugHandlers();

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const postHandler = async (req: Request) => {
  try {
    const body = (await req.json()) as Partial<{ email: string }>;
    const email = (body.email ?? '').trim();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const { siteUrl } = getEmailConfig();
    const recipients = getDefaultAdminRecipients();
    const absoluteLogoUrl = `${siteUrl.replace(/\/$/, '')}/offseasonlogo.png`;

    const detailsTable = renderKeyValueTable([{ label: 'Email', value: email }]);

    const html = renderEmailLayout({
      title: 'Newsletter Signup',
      subtitle: 'A new email address subscribed via the OffSeason site.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: detailsTable
    });

    const text = `Newsletter Signup\n\nEmail: ${email}`;

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'OffSeason — Newsletter Signup',
      html,
      text
    });

    const confirmationHtml = renderEmailLayout({
      title: 'You’re subscribed',
      subtitle: 'Thanks for joining the OffSeason newsletter.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: renderKeyValueTable([{ label: 'Email', value: email }])
    });

    const confirmationText = `You’re subscribed\n\nThanks for joining the OffSeason newsletter.\n\nEmail: ${email}`;

    await sendTransactionalEmail({
      to: email,
      subject: 'OffSeason — Subscription confirmed',
      html: confirmationHtml,
      text: confirmationText
    });

    const marketingSync = await upsertToMarketingListIfConfigured({ email });
    const googleSheetsBackup = await backupSubmissionToGoogleSheets({
      kind: 'newsletter',
      email,
      source: 'website',
      userAgent: req.headers.get('user-agent') ?? undefined
    });

    return NextResponse.json({
      ok: true,
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : { marketingSync, googleSheetsBackup })
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to subscribe.',
        detail: process.env.NODE_ENV === 'production' ? undefined : message
      },
      { status: 500 }
    );
  }
};

export const POST = withApiDebug('forms/newsletter', postHandler);
