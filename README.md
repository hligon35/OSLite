# Offseason Studio Site

Next.js (App Router) + Tailwind scaffolding for the Offseason studio website.

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
- `SENDGRID_FROM_NAME` — Optional (defaults to `Offseason`)
- `SITE_URL` — Base URL used for the email logo link/image (e.g. `https://yourdomain.com`)
- `FORMS_TO_EMAIL` — Optional comma-separated recipient list; if not set, defaults to `hligon@getsparqd.com`
- `FORMS_TEST_TOKEN` — Optional bearer token to protect `POST /api/forms/test`

Dev testing:
- `hligon@getsparqd.com` is always included as a copy for all form emails (bcc) unless it is already in `FORMS_TO_EMAIL`.

Test emails:
- `POST /api/forms/test` sends sample Contact + Newsletter emails so you can preview template styling.
- If `FORMS_TEST_TOKEN` is set, include header: `Authorization: Bearer <token>`.
