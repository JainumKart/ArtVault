import React, { type ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import CheckoutPage from '@/app/checkout/page';
import { CartItem } from '@/types';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const cartItem: CartItem = {
  id: 'cart-test',
  artworkId: 'art-test',
  artworkTitle: 'Test Artwork',
  artworkImage: '/test-artwork.jpg',
  artistId: 'artist-test',
  artistName: 'Test Artist',
  variantId: 'variant-test',
  variantTitle: 'Original',
  variantType: 'ORIGINAL',
  unitPrice: 10000,
  framingPrice: 0,
  totalItemPrice: 10000,
  quantity: 1,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
    localStorage.setItem('artvault_cart', JSON.stringify([cartItem]));
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ success: false, error: 'Order could not be saved.' }),
        })
      )
    );
  });

  it('keeps the cart and does not show success when order creation fails', async () => {
    const { container } = render(<CheckoutPage />, { wrapper });

    fireEvent.submit(container.querySelector('form')!);

    expect((await screen.findByRole('alert', {}, { timeout: 3000 })).textContent).toContain(
      'Order could not be saved.'
    );
    expect(pushMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('artvault_cart')!)).toHaveLength(1);
    });
  });
});
