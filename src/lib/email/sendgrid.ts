import sgMail, { type MailDataRequired } from '@sendgrid/mail';

const DEV_TEST_RECIPIENT = 'hligon@getsparqd.com';

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

  const payload: MailDataRequired = {
    ...(data as Omit<MailDataRequired, 'from'>),
    from: config.from,
    text: data.text ?? ' '
  };

  try {
    await sgMail.send(payload);
    
    // Log successful send for debugging
    if (process.env.DEBUG === 'true') {
      console.log('[SendGrid] Email sent successfully', {
        from: config.from,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject
      });
    }
    
    return { ok: true } as const;
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
    const errorMessage = errors && errors.length > 0
      ? errors
          .map((e) => {
            const parts = [e.message, e.field, e.help].filter(Boolean);
            return parts.join(' | ');
          })
          .join('; ')
      : [
          anyErr.response?.statusCode ? `SendGrid ${anyErr.response.statusCode}` : null,
          anyErr.message || 'Send failed'
        ]
          .filter(Boolean)
          .join(' — ');

    // Always log email errors
    console.error('[SendGrid Error]', {
      error: errorMessage,
      from: config.from,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      statusCode: anyErr.response?.statusCode
    });

    throw new Error(errorMessage);
  }
}
