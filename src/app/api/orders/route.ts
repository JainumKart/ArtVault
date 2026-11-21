import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    if (!customerEmail || !customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer details and order items are required.' },
        { status: 400 }
      );
    }

    // 1. Resolve or create user account
    let targetUserId = userId;
    let dbUser = null;

    if (targetUserId) {
      dbUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    }

    if (!dbUser) {
      dbUser = await prisma.user.findFirst({
        where: { email: customerEmail.toLowerCase().trim() },
      });
    }

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: customerName,
          email: customerEmail.toLowerCase().trim(),
          phone: customerPhone || '+91 98200 12345',
          role: 'COLLECTOR',
          isEmailVerified: true,
          isPhoneVerified: true,
        },
      });
    }
    targetUserId = dbUser.id;

    // 2. Generate Unique Order Number
    const orderNumber = `AV-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Fallback variant and artist lookup to ensure foreign keys
    const fallbackVariant = await prisma.artworkVariant.findFirst({
      include: { artwork: { include: { artist: true } } },
    });
    const fallbackArtist = await prisma.artistProfile.findFirst();

    // 4. Prepare Order Items & Payouts
    const preparedItems = [];
    const preparedPayouts = [];

    // Calculate escrow release date (7 days post-delivery)
    const escrowReleaseDate = new Date();
    escrowReleaseDate.setDate(escrowReleaseDate.getDate() + 7);

    for (const item of items) {
      // Check if variant exists
      let validVariantId = item.variantId;
      let variantExists = null;
      if (validVariantId) {
        variantExists = await prisma.artworkVariant.findUnique({
          where: { id: validVariantId },
        });
      }

      if (!variantExists) {
        validVariantId = fallbackVariant?.id;
      }

      if (!validVariantId) {
        return NextResponse.json(
          { success: false, error: 'No catalog artwork variant available in database.' },
          { status: 400 }
        );
      }

      // Check artist foreign key
      let validArtistId = item.artistId;
      let artistExists = null;
      if (validArtistId) {
        artistExists = await prisma.artistProfile.findUnique({
          where: { id: validArtistId },
        });
      }
      if (!artistExists) {
        validArtistId = fallbackArtist?.id || fallbackVariant?.artwork.artistId;
      }

      const itemTotal = Number(item.totalPrice || item.totalItemPrice || item.unitPrice * (item.quantity || 1));
      const platformFee = Math.round(itemTotal * 0.20); // 20%
      const tdsAmount = Math.round(itemTotal * 0.01); // 1% Indian IT Act 194-O
      const netPayout = itemTotal - platformFee - tdsAmount;

      preparedItems.push({
        variantId: validVariantId,
        artworkTitle: item.artworkTitle || 'Fine Artwork',
        artworkImage: item.artworkImage || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        artistId: validArtistId || 'default-artist',
        artistName: item.artistName || 'Artist',
        variantTitle: item.variantTitle || 'Original Artwork',
        variantType: (item.variantType as any) || 'ORIGINAL',
        editionNumber: item.editionNumber || null,
        framingName: item.selectedFraming?.name || item.framingName || null,
        unitPrice: Number(item.unitPrice || itemTotal),
        framingPrice: Number(item.framingPrice || 0),
        quantity: Number(item.quantity || 1),
        totalPrice: itemTotal,
      });

      if (validArtistId) {
        preparedPayouts.push({
          artistId: validArtistId,
          artworkTitle: item.artworkTitle || 'Fine Artwork',
          grossSaleAmount: itemTotal,
          platformCommissionPercent: 20,
          platformCommissionAmount: platformFee,
          tdsPercent: 1,
          tdsAmount: tdsAmount,
          netPayoutAmount: netPayout,
          status: 'HELD_IN_ESCROW' as const,
          escrowReleaseDate,
        });
      }
    }

    const scheduledPickup = {
      courierPartner: 'Delhivery Art Logistics',
      awbNumber: `DEL-ART-${Math.floor(1000000 + Math.random() * 9000000)}`,
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '2:00 PM - 5:00 PM',
      status: 'SCHEDULED',
      pickupAddress: 'Artist Studio, Whitefield Art District, Bengaluru',
      contactPerson: 'Studio Logistics Manager',
      contactPhone: '+91 98450 11223',
    };

    // 5. Create Order in Database
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: targetUserId,
        customerName,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone || '+91 98200 12345',
        shippingAddress: shippingAddress || {},
        subtotal: Number(subtotal || 0),
        taxGst: Number(taxGst || 0),
        shippingFee: Number(shippingFee || 0),
        total: Number(total || 0),
        orderStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDetails: paymentDetails || {
          gatewayTransactionId: `pay_${Date.now().toString(36)}`,
          paymentTime: new Date().toISOString(),
          paymentMode: paymentMethod,
        },
        scheduledPickup,
        items: {
          create: preparedItems,
        },
        payouts: {
          create: preparedPayouts,
        },
      },
      include: {
        items: true,
        payouts: true,
      },
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('API Error /api/orders POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
