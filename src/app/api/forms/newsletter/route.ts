import {
  getDefaultAdminRecipients,
  getEmailConfig,
  sendTransactionalEmail
} from '@/lib/email/sendgrid';
import { initServerDebugHandlers, withApiDebug } from '@/lib/debug';
import { upsertToMarketingListIfConfigured } from '@/lib/email/sendgridMarketing';
import { backupSubmissionToGoogleSheets } from '@/lib/forms/googleSheetsBackup';
import { renderEmailLayout, renderKeyValueTable } from '@/lib/email/template';
import { hasHoneypotValue, jsonNoStore, validateFormRequest } from '@/lib/security/forms';

export const runtime = 'nodejs';

initServerDebugHandlers();

const MAX_EMAIL_LENGTH = 254;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const postHandler = async (req: Request) => {
  const requestValidationError = validateFormRequest(req);
  if (requestValidationError) {
    return requestValidationError;
  }

  try {
    const body = (await req.json()) as Partial<{ email: string; website: string }>;
    const email = (body.email ?? '').trim();

    if (hasHoneypotValue(body.website)) {
      return jsonNoStore({ ok: true });
    }

    if (!email) {
      return jsonNoStore(
        { ok: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return jsonNoStore(
        { ok: false, error: 'Email exceeds the allowed length.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return jsonNoStore(
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
      subtitle: 'A new email address subscribed via the OFFSEASON site.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: detailsTable
    });

    const text = `Newsletter Signup\n\nEmail: ${email}`;

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'OFFSEASON — Newsletter Signup',
      html,
      text
    });

    const confirmationHtml = renderEmailLayout({
      title: 'You’re subscribed',
      subtitle: 'Thanks for joining the OFFSEASON newsletter.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: renderKeyValueTable([{ label: 'Email', value: email }])
    });

    const confirmationText = `You’re subscribed\n\nThanks for joining the OFFSEASON newsletter.\n\nEmail: ${email}`;

    await sendTransactionalEmail({
      to: email,
      subject: 'OFFSEASON — Subscription confirmed',
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

    return jsonNoStore({
      ok: true,
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : { marketingSync, googleSheetsBackup })
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return jsonNoStore(
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
