import { debug } from '@/lib/debug';

type BackupKind = 'newsletter' | 'contact';

type BackupInput = {
  kind: BackupKind;
  email: string;
  name?: string;
  company?: string;
  message?: string;
  source: 'website';
  userAgent?: string;
};

type BackupResult =
  | { ok: true }
  | { ok: false; skipped?: true; reason: string; status?: number };

function isTrue(value: string | undefined) {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function getConfig() {
  return {
    enabled: isTrue(process.env.GOOGLE_SHEETS_BACKUP_ENABLED),
    webhookUrl: (process.env.GOOGLE_SHEETS_BACKUP_WEBHOOK_URL ?? '').trim(),
    secret: (process.env.GOOGLE_SHEETS_BACKUP_SECRET ?? '').trim()
  };
}

export async function backupSubmissionToGoogleSheets(
  input: BackupInput
): Promise<BackupResult> {
  const config = getConfig();

  if (!config.enabled) {
    return {
      ok: false,
      skipped: true,
      reason: 'GOOGLE_SHEETS_BACKUP_ENABLED is false'
    };
  }

  if (!config.webhookUrl) {
    return {
      ok: false,
      skipped: true,
      reason: 'Missing GOOGLE_SHEETS_BACKUP_WEBHOOK_URL'
    };
  }

  const payload = {
    ...input,
    submittedAt: new Date().toISOString(),
    token: config.secret || undefined
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.secret ? { 'x-offseason-backup-secret': config.secret } : {})
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const body = await response.text();
      const reason = `Google backup webhook failed (${response.status})${
        body ? `: ${body.slice(0, 200)}` : ''
      }`;

      debug.warn('Google Sheets backup request failed', {
        kind: input.kind,
        status: response.status,
        reason
      });

      return {
        ok: false,
        status: response.status,
        reason
      };
    }

    debug.success('Google Sheets backup request succeeded', {
      kind: input.kind,
      email: input.email
    });

    return { ok: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown backup error';

    debug.error('Google Sheets backup request exception', {
      kind: input.kind,
      email: input.email,
      reason
    });

    return { ok: false, reason };
  }
}
