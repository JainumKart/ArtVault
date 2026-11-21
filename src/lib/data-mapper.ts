import { Artwork, ArtworkVariant, Category, CertificateOfAuthenticity } from '@/types';
import { standardFramingOptions } from '@/lib/mock-data';

export function mapDbArtworkToFrontend(item: any): Artwork {
  const originalVariant = item.variants?.find((v: any) => v.type === 'ORIGINAL');
  const printVariant = item.variants?.find((v: any) => v.type === 'LIMITED_PRINT');

  const variants: ArtworkVariant[] = (item.variants || []).map((v: any) => ({
    id: v.id,
    artworkId: v.artworkId || item.id,
    title: v.title,
    type: v.type,
    editionTotal: v.editionTotal || undefined,
    editionAvailable: v.editionAvailable || undefined,
    price: Number(v.price),
    compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
    dimensions: {
      heightCm: Number(v.heightCm || 60),
      widthCm: Number(v.widthCm || 80),
      depthCm: v.depthCm ? Number(v.depthCm) : undefined,
    },
    framingOptions: standardFramingOptions,
    weightKg: Number(v.weightKg || item.weightKg || 2.5),
    inStock: v.inStock ?? true,
  }));

  const coa: CertificateOfAuthenticity = {
    id: item.coa?.id || `coa-${item.id}`,
    tokenNumber: item.coa?.tokenNumber || `AV-COA-2026-${item.id.slice(-4)}`,
    qrCodeHash: item.coa?.qrCodeHash || `AV-QR-${item.id.slice(-6)}`,
    issueDate: item.coa?.issueDate ? new Date(item.coa.issueDate).toISOString() : new Date().toISOString(),
    signedByArtist: item.coa?.signedByArtist ?? true,
    verifiedByCurator: item.coa?.verifiedByCurator ?? true,
  };

  const originalPrice = originalVariant ? Number(originalVariant.price) : Number(variants[0]?.price || 35000);
  const minPrintPrice = printVariant ? Number(printVariant.price) : undefined;

  let packaging: 'ROLLED_TUBE' | 'STRETCHED_BOX' | 'WOODEN_CRATE' = 'WOODEN_CRATE';
  if (item.packagingType === 'ROLLED_TUBE' || String(item.packagingType).toLowerCase().includes('tube')) {
    packaging = 'ROLLED_TUBE';
  } else if (item.packagingType === 'STRETCHED_BOX') {
    packaging = 'STRETCHED_BOX';
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug || item.id,
    artistId: item.artistId || item.artist?.id || 'artist-1',
    artistName: item.artist?.displayName || item.artistName || 'ArtVault Artist',
    artistAvatar: item.artist?.avatarUrl || item.artistAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    artistLocation: item.artist?.location || item.artistLocation || 'Mumbai, India',
    categoryId: item.categoryId || item.category?.id || 'cat-paintings',
    categoryName: item.category?.name || item.categoryName || 'Oil Paintings',
    description: item.description || '',
    medium: item.medium || 'Oil on Canvas',
    style: item.style || 'Contemporary',
    surface: item.surface || 'Canvas',
    year: item.yearCreated || item.year || new Date().getFullYear(),
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
    variants: variants.length > 0 ? variants : [
      {
        id: `var-orig-${item.id}`,
        artworkId: item.id,
        title: 'Original Artwork (1 of 1)',
        type: 'ORIGINAL',
        price: originalPrice,
        dimensions: { heightCm: 60, widthCm: 80 },
        framingOptions: standardFramingOptions,
        weightKg: 2.5,
        inStock: true,
      }
    ],
    isOriginalAvailable: true,
    originalPrice,
    minPrintPrice,
    tags: Array.isArray(item.tags) ? item.tags : ['Original', 'Curated'],
    featured: item.isFeatured ?? item.featured ?? false,
    curatorPick: item.isCuratorPick ?? item.curatorPick ?? false,
    certificateOfAuthenticity: coa,
    shippingInfo: {
      packaging,
      pickupAvailable: true,
      estimatedDays: '3-5 business days',
    },
  };
}
