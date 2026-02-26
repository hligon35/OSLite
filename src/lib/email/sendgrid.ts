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

  const needsDevCopy = !to.includes(DEV_TEST_RECIPIENT);
  const bcc = needsDevCopy ? [DEV_TEST_RECIPIENT] : [];

  return { to, bcc };
}

export function getEmailConfig() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME || 'Offseason';

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

  await sgMail.send(payload);

  return { ok: true } as const;
}
