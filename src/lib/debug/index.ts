export { debug, registerDebugSink, startDebugTimer } from '@/lib/debug/logger';
export { debugFetch } from '@/lib/debug/http';
export { withApiDebug } from '@/lib/debug/api';
export { initServerDebugHandlers } from '@/lib/debug/server';
export { getDebugBuffer, clearDebugBuffer } from '@/lib/debug/buffer';
export { isDebugEnabled, isDebugPanelEnabled } from '@/lib/debug/config';
export type { DebugEntry, DebugLevel, DebugSink } from '@/lib/debug/types';
