import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/artworks/[id] - Fetch single artwork by ID or slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const artwork = await prisma.artwork.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        artist: {
          select: {
            id: true,
            displayName: true,
            slug: true,
            bio: true,
            statement: true,
            avatarUrl: true,
            bannerUrl: true,
            location: true,
            kycStatus: true,
            rating: true,
            exhibitions: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        variants: true,
        coa: {
          select: {
            id: true,
            tokenNumber: true,
            qrCodeHash: true,
            issueDate: true,
            signedByArtist: true,
            verifiedByCurator: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!artwork) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: artwork });
  } catch (error: any) {
    console.error('API Error /api/artworks/[id] GET:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
