import { cacheLife, cacheTag } from "next/cache";

interface RenderTimestampBadgeServerProps {
  label: string;
}

async function fetchTime() {
  const res = await fetch(`https://timeapi.io/api/v1/time/current/utc`);
  if (!res.ok) throw new Error("Failed to fetch time");
  return res.json() as Promise<{ utc_time: string }>;
}

export async function RenderTimestampBadgeServer({
  label,
}: RenderTimestampBadgeServerProps) {
  "use cache"
  cacheTag("timestamp-badge");

  const time = await fetchTime();
  return (
    <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}: <span className="ml-1 font-mono capitalize">{time.utc_time}</span>
    </p>
  );
}
