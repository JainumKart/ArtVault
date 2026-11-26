import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prisma, transaction } = vi.hoisted(() => {
  const artworkVariant = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    updateMany: vi.fn(),
  };
  const user = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
  };
  const order = {
    create: vi.fn(),
  };
  const transaction = {
    artworkVariant,
    user,
    order,
  };

  return {
    transaction,
    prisma: {
      artworkVariant,
      artistProfile: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
      },
      user,
      order,
      $transaction: vi.fn(),
    },
  };
});

vi.mock('@/lib/prisma', () => ({ default: prisma }));

import { POST } from '@/app/api/orders/route';

const artworkVariant = {
  id: 'variant-1',
  title: 'Original',
  type: 'ORIGINAL',
  price: 10000,
  inStock: true,
  editionAvailable: null,
  artwork: {
    id: 'artwork-1',
    title: 'Artwork',
    images: ['/artwork.jpg'],
    status: 'AVAILABLE',
    artistId: 'artist-1',
    artist: { displayName: 'Pragya Jain' },
  },
};

function requestWithItem(item: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Kartik Jain',
      customerEmail: 'kartik@example.com',
      items: [item],
    }),
  });
}

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockImplementation(async callback => callback(transaction));
    transaction.artworkVariant.findUnique.mockResolvedValue(artworkVariant);
    transaction.artworkVariant.findFirst.mockResolvedValue(artworkVariant);
    transaction.artworkVariant.updateMany.mockResolvedValue({ count: 1 });
    transaction.user.findUnique.mockResolvedValue({ id: 'collector-1' });
    transaction.user.findFirst.mockResolvedValue({ id: 'collector-1' });
    transaction.order.create.mockImplementation(async ({ data }) => ({
      orderNumber: data.orderNumber,
      items: data.items.create,
      payouts: data.payouts.create,
    }));
  });

  it('rejects unknown variants instead of substituting another catalog item', async () => {
    transaction.artworkVariant.findUnique.mockResolvedValue(null);

    const response = await POST(requestWithItem({ variantId: 'missing-variant', quantity: 1 }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(transaction.order.create).not.toHaveBeenCalled();
  });

  it('calculates item and order amounts from catalog prices, not client totals', async () => {
    const response = await POST(
      requestWithItem({
        variantId: 'variant-1',
        quantity: 1,
        unitPrice: 1,
        framingPrice: 500000,
        totalPrice: 1,
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    const { data } = transaction.order.create.mock.calls[0][0];
    expect(data.subtotal).toBe(10000);
    expect(data.taxGst).toBe(1200);
    expect(data.shippingFee).toBe(1500);
    expect(data.total).toBe(12700);
    expect(data.items.create[0]).toMatchObject({
      variantId: 'variant-1',
      artistId: 'artist-1',
      artistName: 'Pragya Jain',
      unitPrice: 10000,
      framingPrice: 0,
      quantity: 1,
      totalPrice: 10000,
    });
  });

  it('rejects quantities exceeding remaining limited-print stock', async () => {
    transaction.artworkVariant.findUnique.mockResolvedValue({
      ...artworkVariant,
      type: 'LIMITED_PRINT',
      editionAvailable: 1,
    });

    const response = await POST(
      requestWithItem({ variantId: 'variant-1', quantity: 2 })
    );

    expect(response.status).toBe(409);
    expect(transaction.artworkVariant.updateMany).not.toHaveBeenCalled();
    expect(transaction.order.create).not.toHaveBeenCalled();
  });

  it('does not create an order if inventory changes before the stock update', async () => {
    transaction.artworkVariant.updateMany.mockResolvedValue({ count: 0 });

    const response = await POST(
      requestWithItem({ variantId: 'variant-1', quantity: 1 })
    );

    expect(response.status).toBe(409);
    expect(transaction.order.create).not.toHaveBeenCalled();
  });
});
