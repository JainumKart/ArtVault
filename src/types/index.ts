export type UserRole = 'COLLECTOR' | 'ARTIST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  savedAddresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  displayName: string;
  slug: string;
  bio: string;
  statement?: string;
  avatarUrl: string;
  bannerUrl: string;
  location: string;
  exhibitions: string[];
  commissionRate: number; // e.g. 0.20 for 20%
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  panNumber?: string;
  bankAccountLast4?: string;
  bankIfsc?: string;
  totalSales: number;
  rating: number;
  artworkCount: number;
  joinedDate: string;
}

export type ArtworkMedium =
  | 'Oil on Canvas'
  | 'Acrylic on Canvas'
  | 'Watercolor on Arches Paper'
  | 'Charcoal & Graphite'
  | 'Pen & Ink Sketch'
  | 'Digital Mixed Media'
  | 'Sculpture (Bronze/Clay)'
  | 'Gouache & Gold Leaf';

export type ArtworkStyle =
  | 'Contemporary'
  | 'Abstract Expressionism'
  | 'Realism'
  | 'Impressionism'
  | 'Minimalism'
  | 'Surrealism'
  | 'Indian Folk & Heritage';

export interface FramingOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  previewColor: string;
}

export interface ArtworkVariant {
  id: string;
  artworkId: string;
  title: string;
  type: 'ORIGINAL' | 'LIMITED_PRINT' | 'OPEN_PRINT';
  editionTotal?: number; // e.g. 50
  editionAvailable?: number; // e.g. 18 remaining
  price: number; // in INR ₹
  compareAtPrice?: number;
  dimensions: {
    heightCm: number;
    widthCm: number;
    depthCm?: number;
  };
  framingOptions: FramingOption[];
  weightKg: number;
  inStock: boolean;
}

export interface CertificateOfAuthenticity {
  id: string;
  qrCodeHash: string;
  tokenNumber: string;
  issueDate: string;
  signedByArtist: boolean;
  verifiedByCurator: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  artistLocation: string;
  categoryId: string;
  categoryName: string;
  description: string;
  medium: ArtworkMedium;
  style: ArtworkStyle;
  surface: string;
  year: number;
  images: string[];
  variants: ArtworkVariant[];
  isOriginalAvailable: boolean;
  originalPrice: number;
  minPrintPrice?: number;
  tags: string[];
  featured: boolean;
  curatorPick: boolean;
  certificateOfAuthenticity: CertificateOfAuthenticity;
  shippingInfo: {
    packaging: 'ROLLED_TUBE' | 'STRETCHED_BOX' | 'WOODEN_CRATE';
    pickupAvailable: boolean;
    estimatedDays: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  artworkCount: number;
}

export interface CartItem {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImage: string;
  artistId: string;
  artistName: string;
  variantId: string;
  variantTitle: string;
  variantType: 'ORIGINAL' | 'LIMITED_PRINT' | 'OPEN_PRINT';
  editionNumber?: number; // assigned if limited edition print
  selectedFraming?: FramingOption;
  unitPrice: number;
  framingPrice: number;
  totalItemPrice: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImage: string;
  artistId: string;
  artistName: string;
  variantTitle: string;
  variantType: 'ORIGINAL' | 'LIMITED_PRINT' | 'OPEN_PRINT';
  editionNumber?: number;
  framingName?: string;
  unitPrice: number;
  framingPrice: number;
  quantity: number;
  totalPrice: number;
  status: 'PENDING_PACKING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'DELIVERED';
}

export interface ScheduledPickup {
  id: string;
  courierPartner: 'Delhivery Art Logistics' | 'BlueDart Express' | 'Shiprocket FineArt';
  awbNumber: string;
  pickupDate: string;
  timeSlot: string;
  status: 'SCHEDULED' | 'OUT_FOR_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT';
  pickupAddress: string;
  contactPerson: string;
  contactPhone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  taxGst: number; // 12% on original & print art
  shippingFee: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NETBANKING';
  paymentDetails: {
    upiId?: string;
    cardLast4?: string;
    gatewayTransactionId: string;
    paymentTime: string;
  };
  orderStatus:
    | 'CONFIRMED'
    | 'PACKING_IN_PROGRESS'
    | 'PICKUP_SCHEDULED'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'RETURNED';
  scheduledPickup?: ScheduledPickup;
  createdAt: string;
}

export interface ArtistPayoutLedger {
  id: string;
  orderId: string;
  orderNumber: string;
  artistId: string;
  artworkTitle: string;
  grossSaleAmount: number;
  platformCommissionPercent: number; // e.g. 20%
  platformCommissionAmount: number;
  tdsPercent: number; // 1% as per Indian IT Act 194-O
  tdsAmount: number;
  netPayoutAmount: number;
  status: 'HELD_IN_ESCROW' | 'READY_FOR_SETTLEMENT' | 'TRANSFERRED';
  escrowReleaseDate: string; // 7 days after delivery
  settlementDate?: string;
}
