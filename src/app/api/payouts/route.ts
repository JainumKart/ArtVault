import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/payouts - Fetch payout ledger records
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const artistId = searchParams.get('artistId');
    const status = searchParams.get('status');

    const where: any = {};
    if (artistId) {
      where.artistId = artistId;
    }
    if (status) {
      where.status = status;
    }

    const payouts = await prisma.payout.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            displayName: true,
            bankAccount: true,
            bankIfsc: true,
            panNumber: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: payouts.length, data: payouts });
  } catch (error: any) {
    console.error('API Error /api/payouts GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
