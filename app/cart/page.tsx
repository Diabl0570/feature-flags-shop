import { ShoppingCart } from '@/components/ShoppingCart';
import { CartItem } from '@/types/product';
import Link from 'next/link';
import { Suspense } from 'react';

export default function CartPage() {
  // Mock cart items - in a real app, this would come from a state management solution
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced fitness tracking',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Electronics',
      quantity: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading cart...</div>}>
          <ShoppingCart items={cartItems} />
        </Suspense>      </main>
    </div>
  );
}
