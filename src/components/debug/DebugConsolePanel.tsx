'use client';

import { useEffect, useMemo, useState } from 'react';
import { clearDebugBuffer, getDebugBuffer, isDebugEnabled, isDebugPanelEnabled } from '@/lib/debug';
import type { DebugEntry } from '@/lib/debug';

export function DebugConsolePanel() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DebugEntry[]>([]);

  const enabled = useMemo(
    () => isDebugEnabled() && isDebugPanelEnabled(),
    []
  );

  useEffect(() => {
    if (!enabled) return;

    const refresh = () => setEntries(getDebugBuffer());
    refresh();

    const timer = window.setInterval(refresh, 1000);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled]);

  if (!enabled || !open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[120] h-[40vh] w-[min(640px,95vw)] overflow-hidden rounded border border-white/25 bg-black/90 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/15 px-3 py-2 text-xs uppercase tracking-[0.2em]">
        <span>Debug Console</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="border border-white/20 px-2 py-1 text-[10px]"
            onClick={() => {
              clearDebugBuffer();
              setEntries([]);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="border border-white/20 px-2 py-1 text-[10px]"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
      <div className="h-[calc(40vh-42px)] overflow-auto px-3 py-2 text-xs">
        {entries.length === 0 ? (
          <div className="text-white/60">No debug entries yet.</div>
        ) : (
          <ul className="space-y-2">
            {entries
              .slice()
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="border-b border-white/10 pb-2">
                  <div className="font-semibold text-white/85">
                    [{entry.level.toUpperCase()}] {entry.message}
                  </div>
                  <div className="text-white/50">{entry.timestamp}</div>
                  {entry.meta ? (
                    <pre className="mt-1 overflow-auto whitespace-pre-wrap text-white/70">
                      {JSON.stringify(entry.meta, null, 2)}
                    </pre>
                  ) : null}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
