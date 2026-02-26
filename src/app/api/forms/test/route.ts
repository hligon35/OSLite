import { NextResponse } from 'next/server';
import {
  getDefaultAdminRecipients,
  getEmailConfig,
  sendTransactionalEmail
} from '@/lib/email/sendgrid';
import { renderEmailLayout, renderKeyValueTable } from '@/lib/email/template';

export const runtime = 'nodejs';

function isAuthorized(req: Request) {
  const token = process.env.FORMS_TEST_TOKEN;
  if (!token) {
    return process.env.NODE_ENV !== 'production';
  }

  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${token}`;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { siteUrl } = getEmailConfig();
    const recipients = getDefaultAdminRecipients();

    const contactHtml = renderEmailLayout({
      title: '[TEST] New Contact Submission',
      subtitle: 'Template preview — Contact form',
      siteUrl,
      logoSrc: 'cid:offseasonlogo',
      contentHtml: renderKeyValueTable([
        { label: 'Name', value: 'Test User' },
        { label: 'Email', value: 'test@example.com' },
        { label: 'Company', value: 'OffSeason' },
        {
          label: 'Message',
          value:
            'This is a test submission to preview the email template styling.\n\nIf something looks off, we can adjust spacing, borders, and typography.',
          fullWidth: true
        }
      ])
    });

    const newsletterHtml = renderEmailLayout({
      title: '[TEST] Newsletter Signup',
      subtitle: 'Template preview — Newsletter form',
      siteUrl,
      logoSrc: 'cid:offseasonlogo',
      contentHtml: renderKeyValueTable([
        { label: 'Email', value: 'subscriber@example.com' }
      ])
    });

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'OffSeason — [TEST] Contact Form Template',
      html: contactHtml,
      text: 'Test email — Contact Form Template'
    });

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'OffSeason — [TEST] Newsletter Template',
      html: newsletterHtml,
      text: 'Test email — Newsletter Template'
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to send test emails.',
        detail: process.env.NODE_ENV === 'production' ? undefined : message
      },
      { status: 500 }
    );
  }
}
