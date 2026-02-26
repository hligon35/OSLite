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
    const body = (await req.json()) as Partial<{
      name: string;
      email: string;
      company: string;
      message: string;
    }>;

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const company = (body.company ?? '').trim();
    const message = (body.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
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

    const detailsTable = renderKeyValueTable([
      { label: 'Name', value: name },
      { label: 'Email', value: email },
      { label: 'Company', value: company },
      { label: 'Message', value: message }
    ]);

    const html = renderEmailLayout({
      title: 'New Contact Submission',
      subtitle: 'A message was sent from the Offseason website contact form.',
      siteUrl,
      contentHtml: detailsTable
    });

    const text = `New Contact Submission\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`;

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'Offseason — New Contact Submission',
      html,
      text,
      replyTo: { email, name }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to send message.',
        detail: process.env.NODE_ENV === 'production' ? undefined : message
      },
      { status: 500 }
    );
  }
}
