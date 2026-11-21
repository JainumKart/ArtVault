import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/artworks - Fetch artworks with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const medium = searchParams.get('medium');
    const style = searchParams.get('style');
    const isFeatured = searchParams.get('featured');

    const where: any = {
      status: 'AVAILABLE',
    };

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }
    if (medium && medium !== 'ALL') {
      where.medium = medium;
    }
    if (style && style !== 'ALL') {
      where.style = style;
    }
    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const artworks = await prisma.artwork.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            displayName: true,
            location: true,
            avatarUrl: true,
            kycStatus: true,
            rating: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
        coa: {
          select: {
            tokenNumber: true,
            qrCodeHash: true,
            issueDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: artworks.length, data: artworks });
  } catch (error: any) {
    console.error('API Error /api/artworks GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/artworks - Create artwork listing (Artist Portal)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      artistId,
      categoryId,
      medium,
      style,
      surface,
      yearCreated,
      description,
      images,
      packagingType,
      weightKg,
      originalPrice,
      originalHeightCm,
      originalWidthCm,
      hasLimitedPrints,
      printPrice,
      printEditionTotal,
    } = body;

    if (!title || !artistId || !categoryId || !originalPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required artwork parameters.' },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const tokenNumber = `AV-COA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        slug,
        artistId,
        categoryId,
        medium: medium || 'Oil on Canvas',
        style: style || 'Contemporary',
        surface: surface || 'Belgian Linen Canvas',
        yearCreated: Number(yearCreated) || new Date().getFullYear(),
        description: description || '',
        images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
        packagingType: packagingType || 'CUSTOM_WOODEN_CRATE',
        weightKg: Number(weightKg) || 2.5,
        variants: {
          create: [
            {
              title: 'Original Artwork (1 of 1 Unique Piece)',
              type: 'ORIGINAL',
              price: Number(originalPrice),
              heightCm: Number(originalHeightCm) || 60,
              widthCm: Number(originalWidthCm) || 80,
              weightKg: Number(weightKg) || 2.5,
              inStock: true,
            },
            ...(hasLimitedPrints && printPrice
              ? [
                  {
                    title: 'Museum Archival Giclée Print',
                    type: 'LIMITED_PRINT' as const,
                    editionTotal: Number(printEditionTotal) || 50,
                    editionAvailable: Number(printEditionTotal) || 50,
                    price: Number(printPrice),
                    heightCm: Math.round((Number(originalHeightCm) || 60) * 0.75),
                    widthCm: Math.round((Number(originalWidthCm) || 80) * 0.75),
                    weightKg: 1.0,
                    inStock: true,
                  },
                ]
              : []),
          ],
        },
        coa: {
          create: {
            tokenNumber,
            qrCodeHash: `AV-QR-${Date.now()}`,
            signedByArtist: true,
            verifiedByCurator: true,
          },
        },
      },
      include: {
        variants: true,
        coa: true,
      },
    });

    return NextResponse.json({ success: true, data: newArtwork }, { status: 201 });
  } catch (error: any) {
    console.error('API Error /api/artworks POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
