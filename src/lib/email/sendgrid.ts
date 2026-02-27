import sgMail, { type MailDataRequired } from '@sendgrid/mail';
import fs from 'node:fs';
import path from 'node:path';

const DEV_TEST_RECIPIENT = 'hligon@getsparqd.com';

type SendGridAttachment = {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
  // IMPORTANT: SendGrid helper key-conversion ignores arrays, so attachment objects
  // must already use snake_case keys like `content_id`.
  content_id?: string;
};

let inlineLogoAttachmentCache: SendGridAttachment | null | undefined;

function getInlineLogoAttachment(): SendGridAttachment | null {
  if (inlineLogoAttachmentCache !== undefined) return inlineLogoAttachmentCache;

  try {
    const filePath = path.join(process.cwd(), 'public', 'offseasonlogo.png');
    if (!fs.existsSync(filePath)) {
      inlineLogoAttachmentCache = null;
      return null;
    }

    const content = fs.readFileSync(filePath).toString('base64');
    inlineLogoAttachmentCache = {
      content,
      filename: 'offseasonlogo.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'offseasonlogo'
    };
  } catch {
    inlineLogoAttachmentCache = null;
  }

  return inlineLogoAttachmentCache;
}

function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'
  );
}

function parseEmailList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function getDefaultAdminRecipients() {
  const configured = parseEmailList(process.env.FORMS_TO_EMAIL);
  const to = configured.length > 0 ? configured : [DEV_TEST_RECIPIENT];

  const forceDevBcc = (process.env.FORMS_DEV_BCC ?? '').trim().toLowerCase() === 'true';
  const shouldIncludeDevCopy =
    process.env.NODE_ENV !== 'production' || forceDevBcc;

  const needsDevCopy = shouldIncludeDevCopy && !to.includes(DEV_TEST_RECIPIENT);
  const bcc = needsDevCopy ? [DEV_TEST_RECIPIENT] : [];

  return { to, bcc };
}

export function getEmailConfig() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME || 'OffSeason';

  if (!apiKey) throw new Error('Missing SENDGRID_API_KEY');
  if (!fromEmail) throw new Error('Missing SENDGRID_FROM_EMAIL');

  return {
    apiKey,
    from: { email: fromEmail, name: fromName },
    siteUrl: getSiteUrl()
  };
}

export async function sendTransactionalEmail(
  data: Omit<MailDataRequired, 'from'> & { text?: string }
) {
  const config = getEmailConfig();
  sgMail.setApiKey(config.apiKey);

  const inlineLogo = getInlineLogoAttachment();
  const providedAttachments = (data as Partial<MailDataRequired>).attachments ?? [];
  const attachments = inlineLogo
    ? [
        ...providedAttachments.filter(
          (a) =>
            (a as { content_id?: string; contentId?: string } | undefined)?.content_id !==
              inlineLogo.content_id &&
            (a as { content_id?: string; contentId?: string } | undefined)?.contentId !==
              inlineLogo.content_id
        ),
        inlineLogo
      ]
    : providedAttachments;

  const payload: MailDataRequired = {
    ...(data as Omit<MailDataRequired, 'from'>),
    from: config.from,
    text: data.text ?? ' ',
    attachments: attachments.length > 0 ? attachments : undefined
  };

  try {
    await sgMail.send(payload);
  } catch (err) {
    const anyErr = err as {
      message?: string;
      response?: {
        statusCode?: number;
        body?: {
          errors?: Array<{ message?: string; field?: string; help?: string }>;
        };
      };
    };

    const errors = anyErr.response?.body?.errors;
    if (errors && errors.length > 0) {
      const details = errors
        .map((e) => {
          const parts = [e.message, e.field, e.help].filter(Boolean);
          return parts.join(' | ');
        })
        .join('; ');

      throw new Error(details);
    }

    const status = anyErr.response?.statusCode;
    throw new Error(
      [status ? `SendGrid ${status}` : null, anyErr.message || 'Send failed']
        .filter(Boolean)
        .join(' — ')
    );
  }

  return { ok: true } as const;
}
