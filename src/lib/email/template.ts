type EmailLayoutParams = {
  title: string;
  subtitle?: string;
  contentHtml: string;
  siteUrl: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderEmailLayout({
  title,
  subtitle,
  contentHtml,
  siteUrl
}: EmailLayoutParams) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = subtitle ? escapeHtml(subtitle) : undefined;
  const logoUrl = `${siteUrl.replace(/\/$/, '')}/offseasonlogo.png`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:#000;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${safeTitle}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000;">
      <tr>
        <td align="center" style="padding:28px 16px 8px;">
          <a href="${siteUrl}" style="display:inline-block;text-decoration:none;">
            <img src="${logoUrl}" width="200" alt="Offseason" style="display:block;width:200px;height:auto;" />
          </a>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:760px;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.88);">
            <tr>
              <td style="padding:22px 20px 8px;">
                <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Offseason — Body. Mind. Ownership.</div>
                <div style="margin-top:10px;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;">${safeTitle}</div>
                ${safeSubtitle ? `<div style="margin-top:8px;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.75);">${safeSubtitle}</div>` : ''}
              </td>
            </tr>

            <tr>
              <td style="padding:14px 20px 22px;">
                ${contentHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:12px 16px 28px;">
          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
            © ${new Date().getFullYear()} Offseason
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderKeyValueTable(rows: Array<{ label: string; value: string }>) {
  const items = rows
    .filter((r) => r.value.trim().length > 0)
    .map((r) => {
      const label = escapeHtml(r.label);
      const value = escapeHtml(r.value);
      return `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid rgba(255,255,255,0.10);vertical-align:top;width:160px;">
            <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.60);">${label}</div>
          </td>
          <td style="padding:10px 12px;border-top:1px solid rgba(255,255,255,0.10);vertical-align:top;">
            <div style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.90);white-space:pre-wrap;">${value}</div>
          </td>
        </tr>`;
    })
    .join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.12);border-collapse:separate;border-spacing:0;">
      ${items}
    </table>`;
}
