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

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 4000;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const postHandler = async (req: Request) => {
  const requestValidationError = validateFormRequest(req);
  if (requestValidationError) {
    return requestValidationError;
  }

  try {
    const body = (await req.json()) as Partial<{
      name: string;
      email: string;
      company: string;
      message: string;
      website: string;
    }>;

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const company = (body.company ?? '').trim();
    const message = (body.message ?? '').trim();

    if (hasHoneypotValue(body.website)) {
      return jsonNoStore({ ok: true });
    }

    if (!name || !email || !message) {
      return jsonNoStore(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      company.length > MAX_COMPANY_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return jsonNoStore(
        { ok: false, error: 'One or more fields exceed the allowed length.' },
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

    const detailsTable = renderKeyValueTable([
      { label: 'Name', value: name },
      { label: 'Email', value: email },
      { label: 'Company', value: company },
      { label: 'Message', value: message, fullWidth: true }
    ]);

    const html = renderEmailLayout({
      title: 'New Contact Submission',
      subtitle: 'A message was sent from the OFFSEASON website contact form.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: detailsTable
    });

    const text = `New Contact Submission\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`;

    await sendTransactionalEmail({
      to: recipients.to,
      bcc: recipients.bcc,
      subject: 'OFFSEASON — New Contact Submission',
      html,
      text,
      replyTo: { email, name }
    });

    const confirmationTable = renderKeyValueTable([
      { label: 'Name', value: name },
      { label: 'Email', value: email },
      { label: 'Message', value: message, fullWidth: true }
    ]);

    const confirmationHtml = renderEmailLayout({
      title: 'We received your message',
      subtitle: 'Thanks for reaching out. We’ll get back to you as soon as we can.',
      siteUrl,
      logoSrc: absoluteLogoUrl,
      contentHtml: confirmationTable
    });

    const confirmationText = `We received your message\n\nThanks for reaching out. We’ll get back to you as soon as we can.\n\nYour submission:\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    await sendTransactionalEmail({
      to: email,
      subject: 'OFFSEASON — We received your message',
      html: confirmationHtml,
      text: confirmationText
    });

    const marketingSync = await upsertToMarketingListIfConfigured({
      email,
      firstName: name,
      company
    });
    const googleSheetsBackup = await backupSubmissionToGoogleSheets({
      kind: 'contact',
      email,
      name,
      company,
      message,
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
        error: 'Failed to send message.',
        detail: process.env.NODE_ENV === 'production' ? undefined : message
      },
      { status: 500 }
    );
  }
};

export const POST = withApiDebug('forms/contact', postHandler);
