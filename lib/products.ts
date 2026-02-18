import { Product } from '@/types/product';
import { unstable_cache } from 'next/cache';

export const PRODUCTS_TAG = 'products';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Designer Laptop Bag',
    description: 'Stylish and durable laptop bag with multiple compartments for all your essentials.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'Accessories',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable office chair with lumbar support and adjustable height.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop',
    category: 'Furniture',
  },
  {
    id: '5',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 12-hour playtime.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'Electronics',
  },
  {
    id: '6',
    name: 'Minimalist Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
    category: 'Home',
  },
];

const getProductsCached = unstable_cache(async () => products, ['products-list'], {
  tags: [PRODUCTS_TAG],
});

const getProductByIdCached = unstable_cache(
  async (id: string) => products.find((product) => product.id === id),
  ['products-by-id'],
  {
    tags: [PRODUCTS_TAG],
  }
);

export async function getProducts(): Promise<Product[]> {
  return getProductsCached();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return getProductByIdCached(id);
}
