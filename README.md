# OffSeason Site

Next.js (App Router) + Tailwind scaffolding for the OffSeason website.

## Setup

1. Ensure these files exist in `public/`:
   - `offseasonlogo.png`
   - `rubberLogo.png`
   - `offseason_(2025)_-_official_trailer.mp4`
   - (optional) `season2.png`

2. Install + run:
   - `npm install`
   - `npm run dev`

Open `http://localhost:3000`.

## Forms (SendGrid)

The Contact + Newsletter forms POST to API routes that send email via SendGrid:

- `POST /api/forms/contact`
- `POST /api/forms/newsletter`

Set these environment variables (e.g. in `.env.local`):

- `SENDGRID_API_KEY` — SendGrid API key with Mail Send permissions
- `SENDGRID_FROM_EMAIL` — Verified sender email in SendGrid
- `SENDGRID_FROM_NAME` — Optional (defaults to `OffSeason`)
- `SITE_URL` — Base URL used for the email logo link/image (e.g. `https://yourdomain.com`)
- `FORMS_TO_EMAIL` — Optional comma-separated recipient list; if not set, defaults to `hligon@getsparqd.com`
- `FORMS_DEV_BCC` — Optional (`true`/`false`); if `true`, always bcc `hligon@getsparqd.com` (default behavior is to only bcc in non-production)
- `SENDGRID_MARKETING_LIST_IDS` — Optional comma-separated SendGrid Marketing list IDs; if set, newsletter + contact emails are upserted into these lists
- `FORMS_TEST_TOKEN` — Optional bearer token to protect `POST /api/forms/test`
- `GOOGLE_SHEETS_BACKUP_ENABLED` — Optional (`true`/`false`); enables non-blocking backup writes to Google Sheets
- `GOOGLE_SHEETS_BACKUP_WEBHOOK_URL` — Optional Apps Script Web App URL for backup writes
- `GOOGLE_SHEETS_BACKUP_SECRET` — Optional shared secret sent in payload (`token`) and header for webhook validation

Dev testing:
- In non-production, `hligon@getsparqd.com` is included as a copy for all form emails (bcc) unless it is already in `FORMS_TO_EMAIL`.

Production note:
- If `FORMS_TO_EMAIL` is not set in your deployment, admin notifications will go to the dev fallback address.
- In production, the dev bcc is disabled by default; set `FORMS_DEV_BCC=true` only if you explicitly want those copies.

Test emails:
- `POST /api/forms/test` sends sample Contact + Newsletter emails so you can preview template styling.
- If `FORMS_TEST_TOKEN` is set, include header: `Authorization: Bearer <token>`.

## Google Sheets Backup (Optional)

This project includes a non-blocking backup integration for newsletter + contact submissions.

1. Open `scripts/google-apps-script/offseason-mailing-list-backup.gs` in Google Apps Script.
2. Update `SHARED_SECRET` to a strong value.
3. Deploy as a Web App (execute as you, access set appropriately for your setup).
4. Set in environment:
   - `GOOGLE_SHEETS_BACKUP_ENABLED=true`
   - `GOOGLE_SHEETS_BACKUP_WEBHOOK_URL=<your-web-app-url>`
   - `GOOGLE_SHEETS_BACKUP_SECRET=<same-secret-as-script>`

If SendGrid marketing sync fails or is unavailable, forms still continue normally; this backup path is additive and does not block submissions.
