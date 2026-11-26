import { ArtworkStatus, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async tx => {
    const legacyUserIds = [
      'user-artist-2',
      'user-artist-3',
      'user-artist-4',
      'user-collector-demo',
    ];

    await tx.artwork.deleteMany({
      where: {
        id: { in: ['art-1', 'art-2', 'art-3', 'art-4', 'art-5'] },
        reviews: { none: {} },
        variants: { every: { orderItems: { none: {} } } },
      },
    });
    await tx.artwork.updateMany({
      where: {
        id: { in: ['art-1', 'art-2', 'art-3', 'art-4', 'art-5'] },
        status: ArtworkStatus.AVAILABLE,
      },
      data: { status: ArtworkStatus.RESERVED, isFeatured: false, isCuratorPick: false },
    });
    await tx.artistProfile.deleteMany({
      where: {
        AND: [
          {
            OR: [
              { id: { in: ['artist-2', 'artist-3', 'artist-4'] } },
              { userId: { in: legacyUserIds } },
            ],
          },
          { artworks: { none: {} }, payouts: { none: {} } },
        ],
      },
    });
    await tx.category.deleteMany({
      where: {
        id: { in: ['cat-oil', 'cat-heritage', 'cat-sketches', 'cat-acrylics'] },
        artworks: { none: {} },
      },
    });
    await tx.user.deleteMany({
      where: {
        id: { in: legacyUserIds },
        artistProfile: null,
        orders: { none: {} },
        reviews: { none: {} },
      },
    });

    const users = [
      {
        id: 'user-admin-root',
        name: 'ArtVault Admin',
        email: 'admin@artvault.in',
        phone: '+91 90000 00001',
        role: Role.ADMIN,
      },
      {
        id: 'user-artist-pragya',
        name: 'Pragya Jain',
        email: 'pragya@artvault.in',
        phone: '+91 90000 00002',
        role: Role.ARTIST,
      },
      {
        id: 'user-collector-kartik',
        name: 'Kartik Jain',
        email: 'kartik@artvault.in',
        phone: '+91 90000 00003',
        role: Role.COLLECTOR,
      },
    ];

    for (const user of users) {
      await tx.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: true,
          isEmailVerified: true,
        },
        create: {
          ...user,
          isPhoneVerified: true,
          isEmailVerified: true,
        },
      });
    }
  });

  console.log('Seeded the requested accounts and cleaned up the legacy demo catalog.');
}

main()
  .catch(error => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
