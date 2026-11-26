import React, { type ReactNode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '@/lib/cart-context';
import { Artwork, ArtworkVariant } from '@/types';

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const artwork: Artwork = {
  id: 'art-test',
  title: 'Test Artwork',
  slug: 'test-artwork',
  artistId: 'artist-test',
  artistName: 'Test Artist',
  artistAvatar: '',
  artistLocation: 'Test City',
  categoryId: 'cat-test',
  categoryName: 'Test Category',
  description: 'Artwork for cart tests.',
  medium: 'Oil on Canvas',
  style: 'Contemporary',
  surface: 'Canvas',
  year: 2026,
  images: ['/test-artwork.jpg'],
  variants: [],
  isOriginalAvailable: true,
  originalPrice: 10000,
  tags: [],
  featured: false,
  curatorPick: false,
  certificateOfAuthenticity: {
    id: 'coa-test',
    qrCodeHash: 'hash-test',
    tokenNumber: 'coa-test',
    issueDate: '2026-01-01',
    signedByArtist: true,
    verifiedByCurator: false,
  },
  shippingInfo: {
    packaging: 'WOODEN_CRATE',
    pickupAvailable: true,
    estimatedDays: '3-5 days',
  },
};

const limitedPrint: ArtworkVariant = {
  id: 'variant-print',
  artworkId: artwork.id,
  title: 'Limited print',
  type: 'LIMITED_PRINT',
  editionTotal: 10,
  editionAvailable: 2,
  price: 5000,
  dimensions: { heightCm: 40, widthCm: 30 },
  framingOptions: [],
  weightKg: 1,
  inStock: true,
};

describe('CartProvider', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it('does not allow adding more limited prints than are available', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(artwork, limitedPrint));
    act(() => result.current.addItem(artwork, limitedPrint));
    act(() => result.current.addItem(artwork, limitedPrint));

    expect(result.current.itemCount).toBe(2);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('does not add a variant that is out of stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const unavailable = { ...limitedPrint, inStock: false };

    act(() => result.current.addItem(artwork, unavailable));

    expect(result.current.items).toHaveLength(0);
  });

  it('allows only one original per artwork in the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const original: ArtworkVariant = {
      ...limitedPrint,
      id: 'variant-original',
      type: 'ORIGINAL',
      editionAvailable: undefined,
    };

    act(() => result.current.addItem(artwork, original));
    act(() => result.current.addItem(artwork, original));

    expect(result.current.itemCount).toBe(1);
    expect(result.current.items[0].quantity).toBe(1);
  });
});
