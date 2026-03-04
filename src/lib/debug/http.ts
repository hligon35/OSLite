import { debug, startDebugTimer } from '@/lib/debug/logger';

type DebugFetchContext = {
  feature?: string;
  suppressBody?: boolean;
};

function getUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function getMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase();
  if (typeof input === 'object' && 'method' in input && input.method) {
    return String(input.method).toUpperCase();
  }
  return 'GET';
}

function getBodyPreview(input: RequestInfo | URL, init?: RequestInit, suppressBody?: boolean) {
  if (suppressBody) return undefined;

  const body = init?.body;
  if (!body) return undefined;
  if (typeof body === 'string') {
    return body.length > 300 ? `${body.slice(0, 300)}…` : body;
  }

  return String(body);
}

export async function debugFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  context?: DebugFetchContext
) {
  const method = getMethod(input, init);
  const url = getUrl(input);
  const end = startDebugTimer('fetch', {
    method,
    url,
    feature: context?.feature
  });

  debug.network('Request start', {
    method,
    url,
    feature: context?.feature,
    body: getBodyPreview(input, init, context?.suppressBody)
  });

  try {
    const response = await fetch(input, init);
    const durationMs = end({ status: response.status });

    debug.network('Request complete', {
      method,
      url,
      feature: context?.feature,
      status: response.status,
      ok: response.ok,
      durationMs
    });

    return response;
  } catch (error) {
    const durationMs = end({ failed: true });
    const message = error instanceof Error ? error.message : 'Unknown fetch error';

    debug.error('Request failed', {
      method,
      url,
      feature: context?.feature,
      durationMs,
      error: message
    });

    throw error;
  }
}
