import { ArtistProfile, Artwork, Category, FramingOption, Order, ArtistPayoutLedger } from '@/types';

export const standardFramingOptions: FramingOption[] = [
  {
    id: 'unframed',
    name: 'Unframed / Rolled in Tube',
    description: 'Safely packed in an archival moisture-resistant heavy-duty PVC tube.',
    priceDelta: 0,
    previewColor: '#e2e8f0',
  },
  {
    id: 'raw-oak',
    name: 'Natural Raw Oak Wood',
    description: 'Sustainably sourced natural solid oak with UV-filtering acrylic glass.',
    priceDelta: 3500,
    previewColor: '#d4a373',
  },
  {
    id: 'gallery-black',
    name: 'Minimalist Gallery Black',
    description: 'Matte black aluminum floating frame, museum standard conservation grade.',
    priceDelta: 4200,
    previewColor: '#1a1a1a',
  },
  {
    id: 'classic-gold',
    name: 'Antique Gold Leaf Frame',
    description: 'Hand-gilded bevelled wooden frame with archival white passe-partout matting.',
    priceDelta: 6800,
    previewColor: '#c59b27',
  },
];

export const mockCategories: Category[] = [
  {
    id: 'cat-oil',
    name: 'Oil Paintings',
    slug: 'oil-paintings',
    description: ' A rich, layered, and timeless masterpieces of a painting of people in a boat on a river.',
    imageUrl: 'https://unsplash.com/photos/a-painting-of-people-in-a-boat-on-a-river-HEEvYhNzpEo',
    artworkCount: 0,
  },
  {
    id: 'cat-acrylics',
    name: 'Acrylics & Mixed Media',
    slug: 'acrylics',
    description: 'Vibrant colors, bold textures, and dynamic contemporary compositions.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    artworkCount: 0,
  },
  {
    id: 'cat-sketches',
    name: 'Charcoal & Sketches',
    slug: 'charcoal-sketches',
    description: 'Raw, visceral human studies and architectural drawings with deep chiaroscuro.',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    artworkCount: 0,
  },
  {
    id: 'cat-heritage',
    name: 'Heritage & Indian Folk',
    slug: 'heritage-folk',
    description: 'Contemporary interpretations of Pichwai, Madhubani, Gond, and miniature traditions.',
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    artworkCount: 0,
  },
];

export const mockArtists: ArtistProfile[] = [];
export const mockArtworks: Artwork[] = [];
export const mockOrders: Order[] = [];
export const mockPayouts: ArtistPayoutLedger[] = [];
