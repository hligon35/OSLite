import { debug } from '@/lib/debug/logger';

declare global {
  var __OSLITE_SERVER_DEBUG_HANDLERS__: boolean | undefined;
}

export function initServerDebugHandlers() {
  if (typeof process === 'undefined') return;
  if (globalThis.__OSLITE_SERVER_DEBUG_HANDLERS__) return;

  process.on('uncaughtException', (error) => {
    debug.error('Uncaught exception', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  });

  process.on('unhandledRejection', (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    debug.error('Unhandled rejection', { message, stack });
  });

  globalThis.__OSLITE_SERVER_DEBUG_HANDLERS__ = true;
}
