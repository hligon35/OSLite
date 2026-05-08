'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { isDebugEnabled, isDebugPanelEnabled } from '@/lib/debug';

const DebugConsolePanel = dynamic(
  () => import('@/components/debug/DebugConsolePanel').then((mod) => mod.DebugConsolePanel),
  { ssr: false }
);

const DebugGlobalHandlers = dynamic(
  () => import('@/components/debug/DebugGlobalHandlers').then((mod) => mod.DebugGlobalHandlers),
  { ssr: false }
);

export function DebugClientGate() {
  const [shouldLoadDebugTools, setShouldLoadDebugTools] = useState(false);

  useEffect(() => {
    setShouldLoadDebugTools(isDebugEnabled() || isDebugPanelEnabled());
  }, []);

  if (!shouldLoadDebugTools) {
    return null;
  }

  return (
    <>
      <DebugGlobalHandlers />
      <DebugConsolePanel />
    </>
  );
}