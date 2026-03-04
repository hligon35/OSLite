# Debug System Guide

This project now includes a modular, additive debug system under `src/lib/debug`.

## What Was Added

- Central logger with levels:
  - `info`
  - `warn`
  - `error`
  - `success`
  - `network`
  - `performance`
- Timestamped, color-coded console output in browser and Node.
- Global environment toggles to enable/disable logging.
- Persistent log buffer:
  - Browser: `localStorage`
  - Server: in-memory buffer
  - Optional server file output with rotation
- Safe API request/response wrappers for frontend `fetch`.
- Safe API route wrapper for backend handlers.
- Global error listeners:
  - Browser: `window.onerror`, `unhandledrejection`
  - Server: `uncaughtException`, `unhandledRejection`
- Optional in-app debug panel (`Ctrl+Shift+D`).
- Integration hook for external sinks (Sentry, dashboards, Cloudflare logs, etc.).

## Environment Variables

Set in `.env.local` (development) or your deployment environment:

- `DEBUG=true`
  - Enables debug logs on server.
- `NEXT_PUBLIC_DEBUG=true`
  - Enables debug logs in browser.
- `NEXT_PUBLIC_DEBUG_PANEL=true`
  - Enables in-app debug panel (toggle via `Ctrl+Shift+D`).
- `NEXT_PUBLIC_DEBUG_BUFFER_MAX=300`
  - Browser buffer size.
- `DEBUG_BUFFER_MAX=1000`
  - Server in-memory buffer size.
- `DEBUG_FILE_PATH=.debug/runtime.log`
  - Optional server file log path. Rotates at ~1MB.

## Primary Debug APIs

Import from `@/lib/debug`:

- `debug.info(message, meta?)`
- `debug.warn(message, meta?)`
- `debug.error(message, meta?)`
- `debug.success(message, meta?)`
- `debug.network(message, meta?)`
- `debug.performance(message, meta?)`
- `startDebugTimer(label, meta?)`
- `debugFetch(input, init?, context?)`
- `withApiDebug(name, handler)`
- `registerDebugSink((entry) => {})`
- `getDebugBuffer()`
- `clearDebugBuffer()`

## Usage Examples

### 1) Log with Levels

```ts
import { debug } from '@/lib/debug';

debug.info('Page loaded', { pathname: '/founders' });
debug.warn('Missing optional field', { field: 'company' });
debug.error('Failed operation', { reason: 'timeout' });
```

### 2) Performance Timing

```ts
import { startDebugTimer } from '@/lib/debug';

const end = startDebugTimer('expensive_task', { feature: 'checkout' });
// ... work ...
end({ ok: true });
```

### 3) Wrapped Fetch

```ts
import { debugFetch } from '@/lib/debug';

const res = await debugFetch('/api/forms/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
}, {
  feature: 'newsletter_form'
});
```

### 4) Backend Route Wrapper

```ts
import { withApiDebug } from '@/lib/debug';

const postHandler = async (req: Request) => {
  return new Response(JSON.stringify({ ok: true }));
};

export const POST = withApiDebug('example/route', postHandler);
```

### 5) External Integration Hook

```ts
import { registerDebugSink } from '@/lib/debug';

registerDebugSink((entry) => {
  // forward to Sentry / Cloudflare / custom pipeline
  // send(entry)
});
```

## Files Added

- `src/lib/debug/types.ts`
- `src/lib/debug/config.ts`
- `src/lib/debug/buffer.ts`
- `src/lib/debug/logger.ts`
- `src/lib/debug/http.ts`
- `src/lib/debug/api.ts`
- `src/lib/debug/server.ts`
- `src/lib/debug/index.ts`
- `src/components/debug/DebugGlobalHandlers.tsx`
- `src/components/debug/DebugConsolePanel.tsx`
- `DEBUG.md`

## Existing Files Safely Updated

- `src/app/layout.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/layout/AppShell.tsx`
- `src/app/api/forms/contact/route.ts`
- `src/app/api/forms/newsletter/route.ts`
- `src/app/api/forms/test/route.ts`

## Disable Everything Quickly

Set all debug flags to false or unset:

- `DEBUG`
- `NEXT_PUBLIC_DEBUG`
- `NEXT_PUBLIC_DEBUG_PANEL`

No business logic changes are required to disable the debug layer.
