import { PrismaClient, Role, KycStatus, VariantType, ArtworkStatus, OrderStatus, PaymentStatus, PayoutStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Full ArtVault Catalog to Supabase PostgreSQL ---');

  // 1. Seed System Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@artvault.in' },
    update: {},
    create: {
      id: 'user-admin-root',
      name: 'ArtVault Platform Curator',
      email: 'admin@artvault.in',
      phone: '+91 99000 11223',
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  const artistUser1 = await prisma.user.upsert({
    where: { email: 'artist@artvault.in' },
    update: {},
    create: {
      id: 'user-artist-3',
      name: 'Meera Nambiar',
      email: 'artist@artvault.in',
      phone: '+91 98470 54321',
      role: Role.ARTIST,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  const artistUser2 = await prisma.user.upsert({
    where: { email: 'vikramaditya@artvault.in' },
    update: {},
    create: {
      id: 'user-artist-2',
      name: 'Vikramaditya Rao',
      email: 'vikramaditya@artvault.in',
      phone: '+91 98290 12345',
      role: Role.ARTIST,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  const artistUser4 = await prisma.user.upsert({
    where: { email: 'zubin@artvault.in' },
    update: {},
    create: {
      id: 'user-artist-4',
      name: 'Zubin Mehta-Cooper',
      email: 'zubin@artvault.in',
      phone: '+91 98200 88990',
      role: Role.ARTIST,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  const collectorUser = await prisma.user.upsert({
    where: { email: 'collector@artvault.in' },
    update: {},
    create: {
      id: 'user-collector-demo',
      name: 'Devika Sharma',
      email: 'collector@artvault.in',
      phone: '+91 98201 54321',
      role: Role.COLLECTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  console.log('✓ Users seeded');

  // 2. Seed Artist Profiles
  const profileMeera = await prisma.artistProfile.upsert({
    where: { userId: artistUser1.id },
    update: {},
    create: {
      id: 'artist-3',
      userId: artistUser1.id,
      displayName: 'Meera Nambiar',
      slug: 'meera-nambiar',
      bio: 'Kochi-based contemporary abstract artist known for oceanic palettes, heavy palette-knife impasto, and emotive monsoon atmospherics.',
      statement: 'I paint the memory of rain and stone, where sacred rituals meet the eternal tides.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80',
      location: 'Fort Kochi, Kerala',
      exhibitions: ['Kochi-Muziris Biennale collateral (2023)', 'Aspinwall House Studio Exhibition (2024)'],
      commissionRate: 0.20,
      kycStatus: KycStatus.VERIFIED,
      totalSales: 310000,
      rating: 4.88,
    },
  });

  const profileVikramaditya = await prisma.artistProfile.upsert({
    where: { userId: artistUser2.id },
    update: {},
    create: {
      id: 'artist-2',
      userId: artistUser2.id,
      displayName: 'Vikramaditya Rao',
      slug: 'vikramaditya-rao',
      bio: 'Fourth-generation master painter from Udaipur blending 17th-century Mewar miniature techniques with modern architectural geometries and real 24k gold leaf.',
      statement: 'Miniature art is a form of deep meditation. Every hair of the squirrel-tail brush carries centuries of devotion.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=80',
      location: 'Udaipur, Rajasthan',
      exhibitions: ['National Gallery of Modern Art, New Delhi (2025)', 'Lalit Kala Akademi, Jaipur (2023)'],
      commissionRate: 0.18,
      kycStatus: KycStatus.VERIFIED,
      totalSales: 890000,
      rating: 5.0,
    },
  });

  const profileZubin = await prisma.artistProfile.upsert({
    where: { userId: artistUser4.id },
    update: {},
    create: {
      id: 'artist-4',
      userId: artistUser4.id,
      displayName: 'Zubin Mehta-Cooper',
      slug: 'zubin-cooper',
      bio: 'Architect turned figurative charcoal sketch artist. Capturing the transient vulnerability of Mumbai commuters, street corner tea stalls, and colonial archways.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1600&q=80',
      location: 'Bandra, Mumbai',
      exhibitions: ['Kala Ghoda Arts Festival (2024)', 'Tao Art Gallery (2023)'],
      commissionRate: 0.20,
      kycStatus: KycStatus.VERIFIED,
      totalSales: 215000,
      rating: 4.82,
    },
  });

  console.log('✓ Artist profiles seeded');

  // 3. Seed Categories
  const catOil = await prisma.category.upsert({
    where: { slug: 'oil-paintings' },
    update: {},
    create: {
      id: 'cat-oil',
      name: 'Oil Paintings',
      slug: 'oil-paintings',
      description: 'Rich, layered, and timeless masterpieces on Belgian linen and canvas.',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catHeritage = await prisma.category.upsert({
    where: { slug: 'heritage-folk' },
    update: {},
    create: {
      id: 'cat-heritage',
      name: 'Heritage & Indian Folk',
      slug: 'heritage-folk',
      description: 'Contemporary interpretations of Pichwai, Madhubani, Gond, and miniature traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSketches = await prisma.category.upsert({
    where: { slug: 'charcoal-sketches' },
    update: {},
    create: {
      id: 'cat-sketches',
      name: 'Charcoal & Sketches',
      slug: 'charcoal-sketches',
      description: 'Raw, visceral human studies and architectural drawings with deep chiaroscuro.',
      imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catAcrylics = await prisma.category.upsert({
    where: { slug: 'acrylics' },
    update: {},
    create: {
      id: 'cat-acrylics',
      name: 'Acrylics & Mixed Media',
      slug: 'acrylics',
      description: 'Vibrant colors, bold textures, and dynamic contemporary compositions.',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✓ Categories seeded');

  // 4. Seed Artworks
  // Artwork 1
  await prisma.artwork.upsert({
    where: { slug: 'the-golden-monsoon-of-malabar' },
    update: {},
    create: {
      id: 'art-1',
      artistId: profileMeera.id,
      categoryId: catOil.id,
      title: 'The Golden Monsoon of Malabar',
      slug: 'the-golden-monsoon-of-malabar',
      description: 'An evocative study of Kerala monsoon skies cascading over the Malabar coastline, infused with genuine 24K gold leaf leafing over deep Prussian blue and raw umber.',
      medium: 'Oil on Canvas',
      style: 'Contemporary Realism',
      surface: 'Belgian Linen Canvas',
      yearCreated: 2024,
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'],
      status: ArtworkStatus.AVAILABLE,
      isFeatured: true,
      isCuratorPick: true,
      packagingType: 'CUSTOM_WOODEN_CRATE',
      weightKg: 4.8,
      variants: {
        create: [
          {
            title: 'Original Artwork (1 of 1 Unique Piece)',
            type: VariantType.ORIGINAL,
            price: 85000,
            heightCm: 120,
            widthCm: 90,
            weightKg: 4.8,
            inStock: true,
          },
          {
            title: 'Museum Archival Giclée Print',
            type: VariantType.LIMITED_PRINT,
            editionTotal: 50,
            editionAvailable: 34,
            price: 8500,
            heightCm: 80,
            widthCm: 60,
            weightKg: 1.2,
            inStock: true,
          },
        ],
      },
      coa: {
        create: {
          qrCodeHash: 'AV-QR-2024-9041-MALABAR',
          tokenNumber: 'AV-COA-2024-0891',
          signedByArtist: true,
          verifiedByCurator: true,
        },
      },
    },
  });

  // Artwork 2
  await prisma.artwork.upsert({
    where: { slug: 'shiva-tandava-sacred-geometry' },
    update: {},
    create: {
      id: 'art-2',
      artistId: profileVikramaditya.id,
      categoryId: catHeritage.id,
      title: 'Shiva Tandava & Sacred Geometry',
      slug: 'shiva-tandava-sacred-geometry',
      description: 'Intricate Mewar miniature tempera with genuine lapis lazuli and 24K gold leaf depicting the cosmic rhythm of Nataraja framed by sacred Yantra geometry.',
      medium: 'Gouache & Gold Leaf',
      style: 'Indian Folk & Heritage',
      surface: 'Handmade Wasli Paper',
      yearCreated: 2023,
      images: ['https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80'],
      status: ArtworkStatus.AVAILABLE,
      isFeatured: true,
      packagingType: 'REINFORCED_FLAT_BOX',
      weightKg: 2.1,
      variants: {
        create: [
          {
            title: 'Original Artwork (1 of 1 Unique Piece)',
            type: VariantType.ORIGINAL,
            price: 145000,
            heightCm: 75,
            widthCm: 55,
            weightKg: 2.1,
            inStock: true,
          },
        ],
      },
      coa: {
        create: {
          qrCodeHash: 'AV-QR-2023-7721-TANDAVA',
          tokenNumber: 'AV-COA-2023-0412',
          signedByArtist: true,
          verifiedByCurator: true,
        },
      },
    },
  });

  // Artwork 3
  await prisma.artwork.upsert({
    where: { slug: 'old-delhi-chaiwallah-shadows' },
    update: {},
    create: {
      id: 'art-3',
      artistId: profileZubin.id,
      categoryId: catSketches.id,
      title: 'Old Delhi Chaiwallah & Shadows',
      slug: 'old-delhi-chaiwallah-shadows',
      description: 'Raw, visceral chiaroscuro charcoal sketch capturing the morning steam and quiet concentration of a century-old Chandni Chowk tea master.',
      medium: 'Charcoal & Graphite',
      style: 'Realism',
      surface: '300gsm Arches Paper',
      yearCreated: 2024,
      images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80'],
      status: ArtworkStatus.AVAILABLE,
      isFeatured: true,
      packagingType: 'HEAVY_DUTY_PVC_TUBE',
      weightKg: 1.1,
      variants: {
        create: [
          {
            title: 'Original Artwork (1 of 1 Unique Piece)',
            type: VariantType.ORIGINAL,
            price: 38000,
            heightCm: 60,
            widthCm: 45,
            weightKg: 1.1,
            inStock: true,
          },
        ],
      },
      coa: {
        create: {
          qrCodeHash: 'AV-QR-2024-3310-CHAIWALLAH',
          tokenNumber: 'AV-COA-2024-0994',
          signedByArtist: true,
          verifiedByCurator: true,
        },
      },
    },
  });

  // Artwork 4
  await prisma.artwork.upsert({
    where: { slug: 'monsoon-over-marine-drive' },
    update: {},
    create: {
      id: 'art-4',
      artistId: profileMeera.id,
      categoryId: catOil.id,
      title: 'Monsoon over Marine Drive',
      slug: 'monsoon-over-marine-drive',
      description: 'Heavy textured impasto capturing the roaring Arabian Sea surf hitting the tetrapods of Marine Drive under heavy rain clouds.',
      medium: 'Oil on Canvas',
      style: 'Abstract Expressionism',
      surface: 'Belgian Linen Canvas',
      yearCreated: 2024,
      images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
      status: ArtworkStatus.AVAILABLE,
      isFeatured: true,
      packagingType: 'CUSTOM_WOODEN_CRATE',
      weightKg: 4.2,
      variants: {
        create: [
          {
            title: 'Original Artwork (1 of 1 Unique Piece)',
            type: VariantType.ORIGINAL,
            price: 92000,
            heightCm: 100,
            widthCm: 80,
            weightKg: 4.2,
            inStock: true,
          },
        ],
      },
      coa: {
        create: {
          qrCodeHash: 'AV-QR-2024-8841-MARINEDRIVE',
          tokenNumber: 'AV-COA-2024-1102',
          signedByArtist: true,
          verifiedByCurator: true,
        },
      },
    },
  });

  // Artwork 5
  await prisma.artwork.upsert({
    where: { slug: 'echoes-of-hampi' },
    update: {},
    create: {
      id: 'art-5',
      artistId: profileMeera.id,
      categoryId: catAcrylics.id,
      title: 'Echoes of Hampi',
      slug: 'echoes-of-hampi',
      description: 'Sun-drenched boulder landscapes and Vijayanagara pillared pavilions interpreted through vibrant cadmium acrylics and sandstone dust textures.',
      medium: 'Acrylics & Mixed Media',
      style: 'Contemporary',
      surface: 'Stretched Cotton Canvas',
      yearCreated: 2024,
      images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80'],
      status: ArtworkStatus.AVAILABLE,
      isFeatured: true,
      packagingType: 'CUSTOM_WOODEN_CRATE',
      weightKg: 3.5,
      variants: {
        create: [
          {
            title: 'Original Artwork (1 of 1 Unique Piece)',
            type: VariantType.ORIGINAL,
            price: 64000,
            heightCm: 90,
            widthCm: 70,
            weightKg: 3.5,
            inStock: true,
          },
        ],
      },
      coa: {
        create: {
          qrCodeHash: 'AV-QR-2024-5542-HAMPI',
          tokenNumber: 'AV-COA-2024-1215',
          signedByArtist: true,
          verifiedByCurator: true,
        },
      },
    },
  });

  console.log('✓ All 5 artworks and Certificates of Authenticity seeded to Supabase!');
  console.log('--- Full Catalog Seeding Complete ---');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
