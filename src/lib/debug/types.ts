export type DebugLevel =
  | 'info'
  | 'warn'
  | 'error'
  | 'success'
  | 'network'
  | 'performance';

export type DebugMeta = Record<string, unknown> | undefined;

export type DebugEntry = {
  id: string;
  level: DebugLevel;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
};

export type DebugSink = (entry: DebugEntry) => void;
