import { getDebugBufferLimit } from '@/lib/debug/config';
import type { DebugEntry } from '@/lib/debug/types';

const BROWSER_BUFFER_KEY = 'OSLITE_DEBUG_BUFFER';
let serverBuffer: DebugEntry[] = [];

function isBrowser() {
  return typeof window !== 'undefined';
}

function trim(entries: DebugEntry[]) {
  const limit = getDebugBufferLimit();
  return entries.slice(Math.max(0, entries.length - limit));
}

function readBrowserBuffer() {
  try {
    const raw = window.localStorage.getItem(BROWSER_BUFFER_KEY);
    if (!raw) return [] as DebugEntry[];
    const parsed = JSON.parse(raw) as DebugEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as DebugEntry[];
  }
}

function writeBrowserBuffer(entries: DebugEntry[]) {
  try {
    window.localStorage.setItem(BROWSER_BUFFER_KEY, JSON.stringify(trim(entries)));
  } catch {
    return;
  }
}

export function appendDebugEntry(entry: DebugEntry) {
  if (isBrowser()) {
    const current = readBrowserBuffer();
    current.push(entry);
    writeBrowserBuffer(current);
    return;
  }

  serverBuffer.push(entry);
  serverBuffer = trim(serverBuffer);
}

export function getDebugBuffer() {
  if (isBrowser()) {
    return readBrowserBuffer();
  }

  return [...serverBuffer];
}

export function clearDebugBuffer() {
  if (isBrowser()) {
    window.localStorage.removeItem(BROWSER_BUFFER_KEY);
    return;
  }

  serverBuffer = [];
}
