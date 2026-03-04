import { appendDebugEntry } from '@/lib/debug/buffer';
import { isDebugEnabled } from '@/lib/debug/config';
import type { DebugEntry, DebugLevel, DebugMeta, DebugSink } from '@/lib/debug/types';

const browserStyles: Record<DebugLevel, string> = {
  info: 'color:#60a5fa;font-weight:600',
  warn: 'color:#f59e0b;font-weight:700',
  error: 'color:#ef4444;font-weight:700',
  success: 'color:#22c55e;font-weight:700',
  network: 'color:#a78bfa;font-weight:700',
  performance: 'color:#06b6d4;font-weight:700'
};

const nodeColors: Record<DebugLevel, string> = {
  info: '\x1b[34m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  success: '\x1b[32m',
  network: '\x1b[35m',
  performance: '\x1b[36m'
};

const levelLabel: Record<DebugLevel, string> = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  success: 'SUCCESS',
  network: 'NETWORK',
  performance: 'PERF'
};

const sinks = new Set<DebugSink>();
const resetColor = '\x1b[0m';

function isBrowser() {
  return typeof window !== 'undefined';
}

function nowIso() {
  return new Date().toISOString();
}

function createEntry(level: DebugLevel, message: string, meta?: DebugMeta): DebugEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
    meta,
    timestamp: nowIso()
  };
}

async function tryWriteServerFile(entry: DebugEntry) {
  if (isBrowser()) return;

  try {
    const { getServerLogFilePath } = await import('@/lib/debug/config');
    const filePath = getServerLogFilePath();
    if (!filePath) return;

    const fs = await import('node:fs');
    const path = await import('node:path');

    const absolute = path.default.isAbsolute(filePath)
      ? filePath
      : path.default.join(process.cwd(), filePath);
    const dir = path.default.dirname(absolute);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(absolute)) {
      const stat = fs.statSync(absolute);
      if (stat.size > 1024 * 1024) {
        const archived = `${absolute}.1`;
        if (fs.existsSync(archived)) fs.rmSync(archived);
        fs.renameSync(absolute, archived);
      }
    }
    fs.appendFileSync(absolute, `${JSON.stringify(entry)}\n`);
  } catch {
    return;
  }
}

function writeConsole(entry: DebugEntry) {
  const label = levelLabel[entry.level];
  if (isBrowser()) {
    const style = browserStyles[entry.level];
    if (entry.meta) {
      console.log(`%c[${entry.timestamp}] [${label}] ${entry.message}`, style, entry.meta);
      return;
    }
    console.log(`%c[${entry.timestamp}] [${label}] ${entry.message}`, style);
    return;
  }

  const color = nodeColors[entry.level];
  const base = `${color}[${entry.timestamp}] [${label}]${resetColor} ${entry.message}`;
  if (entry.meta) {
    console.log(base, entry.meta);
    return;
  }
  console.log(base);
}

function emit(level: DebugLevel, message: string, meta?: DebugMeta) {
  if (!isDebugEnabled()) return;
  const entry = createEntry(level, message, meta);
  appendDebugEntry(entry);
  writeConsole(entry);
  tryWriteServerFile(entry).catch(() => {
    return;
  });
  for (const sink of sinks) {
    try {
      sink(entry);
    } catch {
      continue;
    }
  }
}

export function registerDebugSink(sink: DebugSink) {
  sinks.add(sink);
  return () => sinks.delete(sink);
}

export const debug = {
  info(message: string, meta?: DebugMeta) {
    emit('info', message, meta);
  },
  warn(message: string, meta?: DebugMeta) {
    emit('warn', message, meta);
  },
  error(message: string, meta?: DebugMeta) {
    emit('error', message, meta);
  },
  success(message: string, meta?: DebugMeta) {
    emit('success', message, meta);
  },
  network(message: string, meta?: DebugMeta) {
    emit('network', message, meta);
  },
  performance(message: string, meta?: DebugMeta) {
    emit('performance', message, meta);
  }
};

export function startDebugTimer(label: string, meta?: DebugMeta) {
  const start =
    typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now();

  return (extra?: Record<string, unknown>) => {
    const end =
      typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();

    const durationMs = Number((end - start).toFixed(2));
    debug.performance(label, {
      ...(meta ?? {}),
      ...(extra ?? {}),
      durationMs
    });
    return durationMs;
  };
}
