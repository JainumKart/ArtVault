import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categories - Fetch categories with live artwork count from Supabase
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { artworks: true },
        },
      },
    });

    const formatted = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      artworkCount: cat._count.artworks,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('API Error /api/categories GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
