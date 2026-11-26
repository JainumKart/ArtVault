import { NextRequest, NextResponse } from 'next/server';
import { APP_CONFIG } from '@/constants';
import { standardFramingOptions } from '@/lib/mock-data';
import prisma from '@/lib/prisma';

class OrderRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

// GET /api/orders - Fetch orders with role / user filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const artistId = searchParams.get('artistId');
    const orderNumber = searchParams.get('orderNumber');

    const where: any = {};

    if (orderNumber) {
      where.orderNumber = orderNumber;
    } else if (userId) {
      where.userId = userId;
    } else if (artistId) {
      where.items = {
        some: {
          artistId: artistId,
        },
      };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            variant: {
              include: {
                artwork: {
                  include: {
                    coa: true,
                  },
                },
              },
            },
          },
        },
        payouts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    console.error('API Error /api/orders GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/orders - Create a new order with escrow payouts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      taxGst,
      shippingFee,
      total,
      paymentMethod = 'UPI',
      paymentDetails,
    } = body;

    if (
      typeof customerEmail !== 'string' ||
      !customerEmail.trim() ||
      typeof customerName !== 'string' ||
      !customerName.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Customer details and order items are required.' },
        { status: 400 }
      );
    }

    const newOrder = await prisma.$transaction(async tx => {
      const preparedItems = [];
      const preparedPayouts = [];
      let calculatedSubtotal = 0;
      const escrowReleaseDate = new Date();
      escrowReleaseDate.setDate(
        escrowReleaseDate.getDate() + APP_CONFIG.financial.escrowHoldingDays
      );

      for (const item of items) {
        const quantity = item.quantity;
        if (
          typeof item.variantId !== 'string' ||
          !item.variantId ||
          !Number.isSafeInteger(quantity) ||
          quantity < 1
        ) {
          throw new OrderRequestError('Each item needs a valid variant and quantity.', 400);
        }

        const variant = await tx.artworkVariant.findUnique({
          where: { id: item.variantId },
          include: { artwork: { include: { artist: true } } },
        });
        if (!variant) {
          throw new OrderRequestError('An artwork variant in this order no longer exists.', 400);
        }
        if (variant.artwork.status !== 'AVAILABLE') {
          throw new OrderRequestError('An artwork in this order is not available.', 409);
        }
        if (variant.type === 'ORIGINAL' && quantity !== 1) {
          throw new OrderRequestError('An original artwork can only be purchased once.', 409);
        }
        if (
          !variant.inStock ||
          (variant.type === 'LIMITED_PRINT' &&
            (variant.editionAvailable === null || variant.editionAvailable < quantity))
        ) {
          throw new OrderRequestError('The requested quantity is no longer available.', 409);
        }

        const framing = standardFramingOptions.find(
          option => option.id === item.framingId || option.name === item.framingName
        );
        if ((item.framingId || item.framingName) && !framing) {
          throw new OrderRequestError('The selected framing option is invalid.', 400);
        }
        const framingPrice = framing?.priceDelta ?? 0;
        const itemTotal = (variant.price + framingPrice) * quantity;

        const inventoryUpdate = await tx.artworkVariant.updateMany({
          where:
            variant.type === 'LIMITED_PRINT'
              ? {
                  id: variant.id,
                  inStock: true,
                  editionAvailable: { gte: quantity },
                }
              : { id: variant.id, inStock: true },
          data:
            variant.type === 'LIMITED_PRINT'
              ? {
                  editionAvailable: { decrement: quantity },
                  ...(variant.editionAvailable === quantity ? { inStock: false } : {}),
                }
              : { inStock: false },
        });
        if (inventoryUpdate.count !== 1) {
          throw new OrderRequestError('The requested quantity is no longer available.', 409);
        }

        const platformFee = Math.round(
          (itemTotal * APP_CONFIG.financial.defaultCommissionPercent) / 100
        );
        const tdsAmount = Math.round(
          (itemTotal * APP_CONFIG.financial.tdsSection194OPercent) / 100
        );
        calculatedSubtotal += itemTotal;

        preparedItems.push({
          variantId: variant.id,
          artworkTitle: variant.artwork.title,
          artworkImage: variant.artwork.images[0] || '',
          artistId: variant.artwork.artistId,
          artistName: variant.artwork.artist.displayName,
          variantTitle: variant.title,
          variantType: variant.type,
          editionNumber: item.editionNumber || null,
          framingName: framing?.name || null,
          unitPrice: variant.price,
          framingPrice,
          quantity,
          totalPrice: itemTotal,
        });
        preparedPayouts.push({
          artistId: variant.artwork.artistId,
          artworkTitle: variant.artwork.title,
          grossSaleAmount: itemTotal,
          platformCommissionPercent: APP_CONFIG.financial.defaultCommissionPercent,
          platformCommissionAmount: platformFee,
          tdsPercent: APP_CONFIG.financial.tdsSection194OPercent,
          tdsAmount,
          netPayoutAmount: itemTotal - platformFee - tdsAmount,
          status: 'HELD_IN_ESCROW' as const,
          escrowReleaseDate,
        });
      }

      const normalizedEmail = customerEmail.toLowerCase().trim();
      let dbUser = userId
        ? await tx.user.findUnique({ where: { id: userId } })
        : null;
      if (!dbUser) {
        dbUser = await tx.user.findFirst({ where: { email: normalizedEmail } });
      }
      if (!dbUser) {
        dbUser = await tx.user.create({
          data: {
            name: customerName.trim(),
            email: normalizedEmail,
            phone: customerPhone || '+91 98200 12345',
            role: 'COLLECTOR',
            isEmailVerified: true,
            isPhoneVerified: true,
          },
        });
      }

      const taxGst = Math.round(
        (calculatedSubtotal * APP_CONFIG.financial.gstPercent) / 100
      );
      const shippingFee =
        calculatedSubtotal > APP_CONFIG.financial.freeShippingThreshold
          ? 0
          : APP_CONFIG.financial.standardShippingFee;
      const paymentMethodValue =
        typeof paymentMethod === 'string' ? paymentMethod.toUpperCase() : 'UPI';

      return tx.order.create({
        data: {
          orderNumber: `AV-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: dbUser.id,
          customerName: customerName.trim(),
          customerEmail: normalizedEmail,
          customerPhone: customerPhone || '+91 98200 12345',
          shippingAddress: shippingAddress || {},
          subtotal: calculatedSubtotal,
          taxGst,
          shippingFee,
          total: calculatedSubtotal + taxGst + shippingFee,
          orderStatus: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: paymentMethodValue,
          paymentDetails: paymentDetails || {
            gatewayTransactionId: `pay_${Date.now().toString(36)}`,
            paymentTime: new Date().toISOString(),
            paymentMode: paymentMethodValue,
          },
          scheduledPickup: {
            courierPartner: 'Delhivery Art Logistics',
            awbNumber: `DEL-ART-${Math.floor(1000000 + Math.random() * 9000000)}`,
            pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            timeSlot: '2:00 PM - 5:00 PM',
            status: 'SCHEDULED',
            pickupAddress: 'Artist Studio, Whitefield Art District, Bengaluru',
            contactPerson: 'Studio Logistics Manager',
            contactPhone: '+91 98450 11223',
          },
          items: { create: preparedItems },
          payouts: { create: preparedPayouts },
        },
        include: { items: true, payouts: true },
      });
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('API Error /api/orders POST:', error);
    if (error instanceof OrderRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
