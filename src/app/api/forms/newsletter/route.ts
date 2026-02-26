import { NextResponse } from 'next/server';
import {
  getDefaultAdminRecipients,
  getEmailConfig,
  sendTransactionalEmail
} from '@/lib/email/sendgrid';
import { renderEmailLayout, renderKeyValueTable } from '@/lib/email/template';

export const runtime = 'nodejs';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
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

    const detailsTable = renderKeyValueTable([{ label: 'Email', value: email }]);

    const html = renderEmailLayout({
      title: 'Newsletter Signup',
      subtitle: 'A new email address subscribed via the OffSeason site.',
      siteUrl,
      logoSrc: 'cid:offseasonlogo',
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

    return NextResponse.json({ ok: true });
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
}
