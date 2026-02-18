import { render, screen, fireEvent } from '@testing-library/react';
import { ShoppingCart } from '../ShoppingCart';
import { CartItem } from '@/types/product';

const mockItems: CartItem[] = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Description 1',
    price: 50.0,
    image: 'https://example.com/image1.jpg',
    category: 'Category 1',
    quantity: 2,
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Description 2',
    price: 30.0,
    image: 'https://example.com/image2.jpg',
    category: 'Category 2',
    quantity: 1,
  },
];

describe('ShoppingCart', () => {
  it('renders cart with items', () => {
    render(<ShoppingCart items={mockItems} />);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('displays correct total price', () => {
    render(<ShoppingCart items={mockItems} />);

    // 2 * 50 + 1 * 30 = 130
    expect(screen.getByText('$130.00')).toBeInTheDocument();
  });

  it('shows empty cart message when no items', () => {
    render(<ShoppingCart items={[]} />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('increases quantity when + button is clicked', () => {
    render(<ShoppingCart items={mockItems} />);

    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    fireEvent.click(increaseButtons[0]);

    // Quantity should increase from 2 to 3
    // Total should be 3 * 50 + 1 * 30 = 180
    expect(screen.getByText('$180.00')).toBeInTheDocument();
  });

  it('decreases quantity when - button is clicked', () => {
    render(<ShoppingCart items={mockItems} />);

    const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
    fireEvent.click(decreaseButtons[0]);

    // Quantity should decrease from 2 to 1
    // Total should be 1 * 50 + 1 * 30 = 80
    expect(screen.getByText('$80.00')).toBeInTheDocument();
  });

  it('removes item when quantity reaches 0', () => {
    const singleItem: CartItem[] = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Description',
        price: 50.0,
        image: 'https://example.com/image.jpg',
        category: 'Category',
        quantity: 1,
      },
    ];

    render(<ShoppingCart items={singleItem} />);

    const decreaseButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decreaseButton);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('displays checkout button when items exist', () => {
    render(<ShoppingCart items={mockItems} />);

    const checkoutButton = screen.getByText('Checkout');
    expect(checkoutButton).toBeInTheDocument();
  });

  it('does not display checkout button when cart is empty', () => {
    render(<ShoppingCart items={[]} />);

    const checkoutButton = screen.queryByText('Checkout');
    expect(checkoutButton).not.toBeInTheDocument();
  });
});
