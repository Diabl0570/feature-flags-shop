import { ProductCard } from '@/components/ProductCard';
import { RenderTimestampBadge } from '@/components/RenderTimestampBadge';
import { enablePromoBanner, precomputeFlags, showNewLayout } from '@/lib/flags';
import { getProducts } from '@/lib/products';
import { getPrecomputed } from 'flags/next';
import Link from 'next/link';

interface HomePageProps {
  params: Promise<{
    code: string;
  }>;
}

export const generateStaticParams = async () => {
  return []
}

export default async function HomePage({ params }: HomePageProps) {
  const { code } = await params;
  const products = await getProducts();
  const [newLayout, promoBanner] = (await getPrecomputed(
    [showNewLayout, enablePromoBanner],
    precomputeFlags,
    code,
  )) as [boolean, boolean];
  const serverRenderedAt = new Date().toISOString();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Demo Shop</h1>
          <Link
            href="/cart"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Cart
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <RenderTimestampBadge label="Server rendered at" isoTimestamp={serverRenderedAt} />
        </div>

        {promoBanner && (
          <div className="mb-8 rounded-lg bg-blue-600 p-4 text-center text-white">
            <p className="text-lg font-semibold">🎉 Special Offer: Get 20% off your first order!</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Products</h2>
          {newLayout ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}