'use client';

import { useEffect } from 'react';
import { debug, isDebugEnabled } from '@/lib/debug';

export function DebugGlobalHandlers() {
  useEffect(() => {
    if (!isDebugEnabled()) return;

    const onError = (event: ErrorEvent) => {
      debug.error('window.onerror', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      debug.error('window.unhandledrejection', {
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    let observer: PerformanceObserver | null = null;
    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 2000) {
            debug.performance('Slow performance entry detected', {
              entryType: entry.entryType,
              name: entry.name,
              durationMs: Number(entry.duration.toFixed(2))
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      observer?.disconnect();
    };
  }, []);

  return null;
}
