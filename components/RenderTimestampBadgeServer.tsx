import { cacheLife } from "next/cache";

interface RenderTimestampBadgeServerProps {
  label: string;
}

async function fetchRandomPokemon() {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  return res.json() as Promise<{ name: string }>;
}

export async function RenderTimestampBadgeServer({
  label,
}: RenderTimestampBadgeServerProps) {
  "use cache"
  cacheLife("seconds");
  
  const pokemon = await fetchRandomPokemon();
  return (
    <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}: <span className="ml-1 font-mono capitalize">{pokemon.name}</span>
    </p>
  );
}
