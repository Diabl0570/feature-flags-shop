interface RenderTimestampBadgeProps {
  label: string;
  isoTimestamp: string;
}

export function RenderTimestampBadge({ label, isoTimestamp }: RenderTimestampBadgeProps) {
  return (
    <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}: <span className="ml-1 font-mono">{isoTimestamp}</span>
    </p>
  );
}
