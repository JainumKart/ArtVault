import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/artists/[id] - Fetch single artist by ID or slug with their artworks
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const artist = await prisma.artistProfile.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { userId: id }],
      },
      include: {
        artworks: {
          where: { status: 'AVAILABLE' },
          include: {
            variants: true,
            coa: true,
          },
        },
      },
    });

    if (!artist) {
      return NextResponse.json(
        { success: false, error: 'Artist profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: artist });
  } catch (error: any) {
    console.error('API Error /api/artists/[id] GET:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
