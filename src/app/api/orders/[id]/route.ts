import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders/[id] - Fetch single order by id or orderNumber
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                artwork: {
                  include: {
                    coa: true,
                    artist: true,
                  },
                },
              },
            },
          },
        },
        payouts: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('API Error /api/orders/[id] GET:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status (Artist packing, pickup, delivery)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { orderStatus, scheduledPickup } = body;

    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};
    if (orderStatus) {
      dataToUpdate.orderStatus = orderStatus;
    }
    if (scheduledPickup) {
      dataToUpdate.scheduledPickup = scheduledPickup;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: dataToUpdate,
      include: {
        items: true,
        payouts: true,
      },
    });

    // If order is delivered, update payouts to READY_FOR_SETTLEMENT
    if (orderStatus === 'DELIVERED') {
      await prisma.payout.updateMany({
        where: { orderId: existingOrder.id },
        data: { status: 'READY_FOR_SETTLEMENT' },
      });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error('API Error /api/orders/[id] PATCH:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
