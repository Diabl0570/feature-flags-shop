import { Suspense } from 'react';
import { RenderTimestampBadgeClient } from './RenderTimestampBadgeClient';
import { RenderTimestampBadgeServer } from './RenderTimestampBadgeServer';

interface RenderTimestampBadgeProps {
  label: string;
}

function TimestampBadgeFallback() {
  return (
    <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
      <span className="animate-pulse">…</span>
    </p>
  );
}

export function RenderTimestampBadge({ label }: RenderTimestampBadgeProps) {
  return (
    <Suspense fallback={<TimestampBadgeFallback />}>
      <RenderTimestampBadgeServer label={label} />
    </Suspense>
  );
}
