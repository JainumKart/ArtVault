/**
 * ArtVault Platform Constants & Global Configurations
 */

export * from './styles';

export const APP_CONFIG = {
  name: 'ArtVault',
  tagline: 'Curated Fine Art & Original Masterpiece Marketplace',
  domain: 'https://artvault-eight.vercel.app',
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },
  // Indian Financial & Tax Compliance Constants
  financial: {
    defaultCommissionPercent: 20, // 20% platform marketplace fee
    gstPercent: 12, // 12% GST on fine artwork under HSN 9701
    tdsSection194OPercent: 1, // 1% statutory TDS under Indian Income Tax Act 194-O
    freeShippingThreshold: 15000, // Free insured transit for orders over ₹15,000
    standardShippingFee: 1500, // Standard white-glove courier pickup fee
    escrowHoldingDays: 7, // 7-day buyer inspection & authenticity escrow window
  },
  // Scheduled Logistics Courier Partners
  couriers: [
    { id: 'delhivery', name: 'Delhivery Fine Art Express', service: 'Air Priority' },
    { id: 'bluedart', name: 'BlueDart Apex Secured Art Transit', service: 'White-Glove Pickup' },
  ],
  // Storage Keys
  storageKeys: {
    theme: 'artvault_theme',
    cart: 'artvault_cart',
    role: 'artvault_user_role',
  },
} as const;

export const INDIAN_STATES = [
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Kerala',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Uttar Pradesh',
  'Goa',
] as const;

export const NAV_LINKS = [
  { href: '/artworks', label: 'Explore Artworks' },
  { href: '/categories', label: 'Categories' },
  { href: '/artists', label: 'Featured Artists' },
] as const;
