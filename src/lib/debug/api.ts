import { debug, startDebugTimer } from '@/lib/debug/logger';

type ApiHandler = (req: Request) => Promise<Response>;

export function withApiDebug(name: string, handler: ApiHandler): ApiHandler {
  return async function wrappedHandler(req: Request) {
    const method = req.method;
    const url = req.url;
    const end = startDebugTimer(`api:${name}`, { method, url });

    debug.network('API request', { name, method, url });

    try {
      const response = await handler(req);
      const durationMs = end({ status: response.status });

      debug.network('API response', {
        name,
        method,
        url,
        status: response.status,
        durationMs
      });

      return response;
    } catch (error) {
      const durationMs = end({ failed: true });
      const message = error instanceof Error ? error.message : 'Unknown API error';

      debug.error('API unhandled exception', {
        name,
        method,
        url,
        durationMs,
        error: message
      });

      throw error;
    }
  };
}
