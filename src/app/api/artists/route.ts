import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/artists - List all artist profiles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kycStatus = searchParams.get('kycStatus');

    const where: any = {};
    if (kycStatus) {
      where.kycStatus = kycStatus;
    }

    const artists = await prisma.artistProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            artworks: true,
          },
        },
      },
      orderBy: { totalSales: 'desc' },
    });

    const formatted = artists.map(artist => ({
      id: artist.id,
      userId: artist.userId,
      displayName: artist.displayName,
      slug: artist.slug,
      bio: artist.bio,
      statement: artist.statement,
      avatarUrl: artist.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bannerUrl: artist.bannerUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      location: artist.location,
      exhibitions: artist.exhibitions,
      commissionRate: artist.commissionRate,
      kycStatus: artist.kycStatus,
      totalSales: artist.totalSales,
      rating: artist.rating,
      artworkCount: artist._count.artworks,
      joinedDate: artist.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    console.error('API Error /api/artists GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/artists - Create or register artist profile
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      displayName,
      bio,
      statement,
      location,
      panNumber,
      bankAccount,
      bankIfsc,
    } = body;

    if (!displayName || !userId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Display Name are required.' },
        { status: 400 }
      );
    }

    const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const newProfile = await prisma.artistProfile.create({
      data: {
        userId,
        displayName,
        slug,
        bio: bio || 'Contemporary fine artist exploring rich textures and vibrant aesthetics.',
        statement: statement || '',
        location: location || 'Mumbai, India',
        panNumber: panNumber || '',
        bankAccount: bankAccount || '',
        bankIfsc: bankIfsc || '',
        kycStatus: 'VERIFIED',
      },
    });

    // Update user role to ARTIST
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ARTIST' },
    });

    return NextResponse.json({ success: true, data: newProfile }, { status: 201 });
  } catch (error: any) {
    console.error('API Error /api/artists POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
