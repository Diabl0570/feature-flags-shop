import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { Product } from '@/types/product';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  category: 'Test Category',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('has a link to the product detail page', () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    const link = container.querySelector('a[href="/products/1"]');
    expect(link).toBeInTheDocument();
  });

  it('displays truncated description for long text', () => {
    const longDescriptionProduct = {
      ...mockProduct,
      description: 'This is a very long product description that should be truncated'.repeat(5),
    };

    render(<ProductCard product={longDescriptionProduct} />);

    const description = screen.getByText(/This is a very long product description/);
    expect(description).toHaveClass('line-clamp-2');
  });
});
