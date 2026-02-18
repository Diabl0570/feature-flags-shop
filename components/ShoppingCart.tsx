'use client';

import { useState } from 'react';
import { CartItem } from '@/types/product';

interface ShoppingCartProps {
  items: CartItem[];
}

export function ShoppingCart({ items: initialItems }: ShoppingCartProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      setItems(
        items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4 text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-colors">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
