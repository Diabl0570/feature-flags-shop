# Demo Shop - eCommerce Next.js Application

A demo eCommerce application built with Next.js 16, featuring feature flags for conditional rendering and a Vercel-style override toolbar.

## Features

- **Product Catalog**: Browse through a collection of products with detailed information
- **Product Details**: View individual product pages with images and descriptions
- **Shopping Cart**: Add items to cart with quantity management
- **Feature Flags**: Conditional rendering using Flags SDK for A/B testing different layouts
- **Override Toolbar**: Developer toolbar to test flag variations in real-time

## Feature Flags & Override Toolbar

This application demonstrates feature flag integration using the Flags SDK with a built-in developer toolbar for testing flag variations.

### Feature Flag Toolbar

The toolbar appears in the bottom-right corner during development and provides:

- **View All Flags**: See all feature flags with descriptions
- **Toggle Overrides**: Click toggles to enable/disable flag variations
- **Instant Apply**: Changes apply immediately with automatic page reload
- **Reset**: Clear all overrides to return to defaults
- **Browser-Based**: Overrides stored in encrypted cookies, affecting only your browser

To use the toolbar:
1. Start the development server (`pnpm dev`)
2. Look for the "Feature Flags" button in the bottom-right corner
3. Click to expand and view all available flags
4. Toggle flags to test different variations
5. Click "Reset All Overrides" to clear all changes

### Implemented Flags

1. **showNewLayout** (boolean)
   - Controls product grid layout (3-column vs 4-column)
   - Affects product detail page layout style
   - Default: `false`

2. **enablePromoBanner** (boolean)
   - Shows/hides promotional banner on homepage
   - Default: `true`

### Flag Implementation

The feature flags are implemented using the Flags SDK (`flags/next`):

```typescript
// lib/flags.ts
import { flag } from 'flags/next';

export const showNewLayout = flag<boolean>({
  key: 'showNewLayout',
  description: 'Show new product layout design (4-column vs 3-column grid)',
  options: [true, false],
  defaultValue: false,
  decide: () => false,
});
```

Usage in components:
```typescript
import { showNewLayout } from '@/lib/flags';

export default async function Page() {
  const newLayout = await showNewLayout();
  // Use the flag value to conditionally render
}
```

### Architecture

The override system consists of:

1. **Flags Definition** (`lib/flags.ts`): Flags defined with explicit options
2. **Discovery Endpoint** (`.well-known/vercel/flags`): Exposes flag metadata
3. **Override API** (`api/flag-overrides`): Sets encrypted override cookies
4. **Toolbar UI** (`components/FlagsToolbar.tsx`): Developer interface

Overrides use the standard `vercel-flag-overrides` cookie and `encryptOverrides()` function, ensuring full compatibility with the Flags SDK override system.

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

## Project Structure

```
demo-shop/
├── app/
│   ├── cart/           # Shopping cart page
│   ├── products/[id]/  # Product detail pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage with product grid
├── components/
│   ├── ProductCard.tsx     # Product card component
│   ├── ShoppingCart.tsx    # Shopping cart component
│   └── __tests__/          # Component tests
├── lib/
│   ├── flags.ts        # Feature flag configuration
│   └── products.ts     # Mock product data
└── types/
    └── product.ts      # TypeScript types
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library
- **Feature Flags**: Custom implementation (ready for integration)

## Component Tests

The application includes comprehensive component tests:

- `ProductCard.test.tsx`: Tests for product card rendering and interactions
- `ShoppingCart.test.tsx`: Tests for cart functionality, quantity updates, and checkout flow

Run tests with:
```bash
pnpm test
```

## Future Enhancements

- Connect to real feature flag service (@flags-sdk/vercel, LaunchDarkly, etc.)
- Add state management for shopping cart persistence
- Implement checkout flow
- Add product search and filtering
- User authentication
- Order history

