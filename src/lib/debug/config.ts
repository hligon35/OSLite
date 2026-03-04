const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function readBoolean(value: string | undefined) {
  if (!value) return false;
  return TRUE_VALUES.has(value.trim().toLowerCase());
}

function readNumber(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

export function isDebugEnabled() {
  if (isBrowser()) {
    const envEnabled = readBoolean(process.env.NEXT_PUBLIC_DEBUG);
    const localEnabled = readBoolean(
      window.localStorage.getItem('OSLITE_DEBUG') ?? undefined
    );
    return envEnabled || localEnabled;
  }

  return readBoolean(process.env.DEBUG) || readBoolean(process.env.NEXT_PUBLIC_DEBUG);
}

export function isDebugPanelEnabled() {
  return readBoolean(process.env.NEXT_PUBLIC_DEBUG_PANEL);
}

export function getDebugBufferLimit() {
  if (isBrowser()) {
    return readNumber(process.env.NEXT_PUBLIC_DEBUG_BUFFER_MAX, 300);
  }

  return readNumber(process.env.DEBUG_BUFFER_MAX, 1000);
}

export function getServerLogFilePath() {
  return process.env.DEBUG_FILE_PATH?.trim() || '';
}
