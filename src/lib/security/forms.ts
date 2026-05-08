import { NextResponse } from 'next/server';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_FORM_BODY_LENGTH = 6_000;
const JSON_CONTENT_TYPE = 'application/json';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getSiteOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    'http://localhost:3000';

  try {
    return new URL(raw).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

function getClientIdentifier(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = req.headers.get('x-real-ip');
  return realIp?.trim() || 'unknown';
}

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function validateFormRequest(req: Request) {
  const origin = req.headers.get('origin');
  const allowedOrigin = getSiteOrigin();

  if (origin && origin !== allowedOrigin) {
    return jsonNoStore(
      { ok: false, error: 'Invalid request origin.' },
      { status: 403 }
    );
  }

  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_FORM_BODY_LENGTH) {
    return jsonNoStore(
      { ok: false, error: 'Request payload is too large.' },
      { status: 413 }
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (contentLength > 0 && !contentType.toLowerCase().includes(JSON_CONTENT_TYPE)) {
    return jsonNoStore(
      { ok: false, error: 'Unsupported content type.' },
      { status: 415 }
    );
  }

  const now = Date.now();
  cleanupExpiredEntries(now);

  const key = `${getClientIdentifier(req)}:${new URL(req.url).pathname}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return null;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return jsonNoStore(
      { ok: false, error: 'Too many submissions. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((current.resetAt - now) / 1000))
        }
      }
    );
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return null;
}

export function hasHoneypotValue(value: string | undefined) {
  return Boolean(value?.trim());
}

export function jsonNoStore(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store');

  return NextResponse.json(body, {
    ...init,
    headers
  });
}