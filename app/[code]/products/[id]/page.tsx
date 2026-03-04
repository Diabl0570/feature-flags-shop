import { RenderTimestampBadge } from '@/components/RenderTimestampBadge';
import { getPrecomputedForCode, precomputeFlags } from '@/lib/flags';
import { getProductById } from '@/lib/products';
import { generatePermutations } from 'flags/next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{
    code: string;
    id: string;
  }>;
}

export const generateStaticParams = async () => {
  const codes = await generatePermutations(precomputeFlags);
  const productIds = [1,2,3]; // important products we want to pre-render
  return codes.flatMap((code) => productIds.map((id) => ({ code, id: id.toString() })));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code, id } = await params;
  const product = await getProductById(id);
  const [newLayout] = await getPrecomputedForCode(code);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <RenderTimestampBadge label="Server rendered at"  />
        </div>

        {newLayout ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-2 text-sm text-gray-600">{product.category}</p>
              </div>
              <p className="text-xl text-gray-700">{product.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              </div>
              <button className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8">
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-lg text-gray-700">{product.description}</p>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}