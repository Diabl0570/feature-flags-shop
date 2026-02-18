import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
