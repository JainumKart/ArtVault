'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  mockArtworks,
  mockOrders,
  mockPayouts,
  mockCategories,
} from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/utils';
import { Order } from '@/types';
import {
  Palette,
  Package,
  TrendingUp,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Upload,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ArtistDashboardPage() {
  const { user, activeArtistProfile, setRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'new-listing' | 'orders' | 'ledger'>('listings');

  // Filter artworks for this artist
  const artistId = activeArtistProfile?.id || 'artist-1';
  const [artistArtworks, setArtistArtworks] = useState(
    mockArtworks.filter(a => a.artistId === artistId)
  );

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(mockCategories[0].id);
  const [newMedium, setNewMedium] = useState('Oil on Canvas');
  const [newSurface, setNewSurface] = useState('Belgian Linen Canvas');
  const [newPrice, setNewPrice] = useState('45000');
  const [newHeight, setNewHeight] = useState('60');
  const [newWidth, setNewWidth] = useState('80');
  const [newWeight, setNewWeight] = useState('2.5');
  const [newPackaging, setNewPackaging] = useState('Archival PVC Tube');
  const [hasLimitedPrints, setHasLimitedPrints] = useState(false);
  const [printPrice, setPrintPrice] = useState('5500');
  const [printTotalEdition, setPrintTotalEdition] = useState('50');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
  );
  const [listingSuccessMsg, setListingSuccessMsg] = useState<string | null>(null);

  // Scheduled pickup dispatch state
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newArt: any = {
      id: `art-custom-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      artistId,
      artistName: activeArtistProfile?.displayName || 'Meera Nambiar',
      artistAvatar: activeArtistProfile?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      artistLocation: activeArtistProfile?.location || 'Bengaluru, Karnataka',
      categoryId: newCategory,
      categoryName: mockCategories.find(c => c.id === newCategory)?.name || 'Oil Paintings',
      medium: newMedium as any,
      surface: newSurface,
      style: 'Contemporary' as any,
      year: new Date().getFullYear(),
      description: `Newly submitted fine artwork by ${activeArtistProfile?.displayName}.`,
      images: [newImageUrl],
      isOriginalAvailable: true,
      originalPrice: parseFloat(newPrice) || 35000,
      minPrintPrice: hasLimitedPrints ? parseFloat(printPrice) || 5500 : undefined,
      tags: ['Original', newMedium],
      featured: false,
      curatorPick: false,
      shippingInfo: {
        packaging: (newPackaging.includes('Tube') ? 'ROLLED_TUBE' : 'WOODEN_CRATE') as any,
        pickupAvailable: true,
        estimatedDays: '3-5 business days',
      },
      variants: [
        {
          id: `var-orig-${Date.now()}`,
          artworkId: `art-custom-${Date.now()}`,
          title: 'Unique 1-of-1 Original',
          type: 'ORIGINAL' as any,
          price: parseFloat(newPrice) || 35000,
          dimensions: {
            heightCm: parseFloat(newHeight) || 60,
            widthCm: parseFloat(newWidth) || 80,
          },
          framingOptions: [],
          weightKg: parseFloat(newWeight) || 2.0,
          inStock: true,
        },
        ...(hasLimitedPrints
          ? [
              {
                id: `var-print-${Date.now()}`,
                artworkId: `art-custom-${Date.now()}`,
                title: 'Archival Giclée Print on Cotton Rag',
                type: 'LIMITED_PRINT' as any,
                price: parseFloat(printPrice) || 5500,
                editionTotal: parseInt(printTotalEdition) || 50,
                editionAvailable: parseInt(printTotalEdition) || 50,
                dimensions: {
                  heightCm: parseFloat(newHeight) || 60,
                  widthCm: parseFloat(newWidth) || 80,
                },
                framingOptions: [],
                weightKg: 1.0,
                inStock: true,
              },
            ]
          : []),
      ],
      certificateOfAuthenticity: {
        id: `coa-${Date.now()}`,
        qrCodeHash: `HASH-${Date.now()}`,
        tokenNumber: `COA-VER-${Date.now().toString().slice(-6)}`,
        issueDate: new Date().toISOString(),
        signedByArtist: true,
        verifiedByCurator: false,
      },
    };

    setArtistArtworks([newArt, ...artistArtworks]);
    setListingSuccessMsg(`Artwork "${newTitle}" created and submitted for curator review!`);
    setActiveTab('listings');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders(
      orders.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-serif text-2xl font-bold">
            <Palette className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Artist Studio &amp; Listing Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged in as: <strong>{activeArtistProfile?.displayName || 'Meera Nambiar'}</strong> &bull; Bank: HDFC Bank (••4492) &bull; 20% Standard Platform Commission Split
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new-listing')}
          className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Artwork Listing
        </button>
      </div>

      {/* Financial Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Gross Artwork Sales</span>
          <p className="font-serif text-2xl font-bold text-foreground">₹2,84,000</p>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% from last month
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Platform Commission (20%)</span>
          <p className="font-serif text-2xl font-bold text-foreground">₹56,800</p>
          <p className="text-[11px] text-muted-foreground">Standard curated marketplace fee</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">TDS Deducted (1% u/s 194-O)</span>
          <p className="font-serif text-2xl font-bold text-foreground">₹2,840</p>
          <p className="text-[11px] text-muted-foreground">Remitted to IT Dept (Form 26AS)</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2 bg-primary/5 border-primary/20">
          <span className="text-xs text-primary font-bold">Net Cleared Studio Payout</span>
          <p className="font-serif text-2xl font-bold text-primary">₹2,24,360</p>
          <p className="text-[11px] text-muted-foreground">Transferred to Bank Account</p>
        </div>
      </div>

      {/* Tabs Strip */}
      <div className="flex items-center gap-3 border-b border-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          My Listed Artworks ({artistArtworks.length})
        </button>

        <button
          onClick={() => setActiveTab('new-listing')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'new-listing'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          + New Artwork Studio
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Scheduled Pickup Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'ledger'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Payout &amp; Escrow Ledger
        </button>
      </div>

      {listingSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <span>{listingSuccessMsg}</span>
          <button onClick={() => setListingSuccessMsg(null)} className="font-bold">
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: LISTINGS VIEW */}
      {activeTab === 'listings' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-foreground">
              Current Studio Listings
            </h3>
            <span className="text-xs text-muted-foreground">
              Each artwork is assigned a verifiable COA token.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Medium &amp; Surface</th>
                  <th className="py-3 px-4">Edition Type</th>
                  <th className="py-3 px-4">Original Price</th>
                  <th className="py-3 px-4">COA Token</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {artistArtworks.map(art => {
                  const orig = art.variants.find(v => v.type === 'ORIGINAL') || art.variants[0];
                  return (
                    <tr key={art.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={art.images[0]}
                          alt={art.title}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm">{art.title}</p>
                          <p className="text-muted-foreground text-[11px]">{art.year}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {art.medium} &bull; {art.surface}
                      </td>
                      <td className="py-3.5 px-4">
                        {art.minPrintPrice ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300">
                            Original + Prints
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                            1-of-1 Original
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-foreground">
                        {formatINR(orig.price)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        {art.certificateOfAuthenticity.tokenNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          Available
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NEW LISTING FORM */}
      {activeTab === 'new-listing' && (
        <form
          onSubmit={handleCreateListing}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl"
        >
          <div className="border-b border-border pb-4">
            <h3 className="font-serif font-bold text-lg text-foreground">
              Submit New Artwork for Verification &amp; Curation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify packaging details, dimensional measurements, and optional limited edition prints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-foreground block mb-1">Artwork Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Whispers of the Malabar Coast"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Medium</label>
              <select
                value={newMedium}
                onChange={e => setNewMedium(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              >
                <option value="Oil on Canvas">Oil on Canvas</option>
                <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                <option value="Charcoal & Graphite">Charcoal & Graphite</option>
                <option value="Watercolor on Arches Paper">Watercolor on Arches Paper</option>
                <option value="Gouache & Gold Leaf">Gouache & Gold Leaf</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Surface Base</label>
              <input
                type="text"
                value={newSurface}
                onChange={e => setNewSurface(e.target.value)}
                placeholder="e.g. Belgian Linen / Handmade Cotton Rag"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Original Artwork Price (INR ₹)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Height (cm)</label>
              <input
                type="number"
                value={newHeight}
                onChange={e => setNewHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Width (cm)</label>
              <input
                type="number"
                value={newWidth}
                onChange={e => setNewWidth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Weight for Courier (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Studio Packaging Method</label>
              <select
                value={newPackaging}
                onChange={e => setNewPackaging(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              >
                <option value="Archival PVC Heavy Duty Tube">Archival PVC Heavy Duty Tube</option>
                <option value="Reinforced Custom Wooden Box Crate">Reinforced Custom Wooden Box Crate</option>
                <option value="Double-Walled Flat Art Carton">Double-Walled Flat Art Carton</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-foreground block mb-1">High-Res Image URL</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Limited Edition Prints Toggle */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="printsToggle"
                checked={hasLimitedPrints}
                onChange={e => setHasLimitedPrints(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="printsToggle" className="text-xs font-bold text-foreground cursor-pointer">
                Also offer Certified Limited Edition Giclée Prints alongside the original
              </label>
            </div>

            {hasLimitedPrints && (
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Print Price (₹)</label>
                  <input
                    type="number"
                    value={printPrice}
                    onChange={e => setPrintPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Edition Limit (e.g. 50)</label>
                  <input
                    type="number"
                    value={printTotalEdition}
                    onChange={e => setPrintTotalEdition(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              Submit Artwork Listing
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SCHEDULED PICKUP ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-foreground">
                Scheduled Studio Pickup Orders
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mark artwork as packed in archival tube to trigger scheduled courier pickup from Delhivery/BlueDart.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              White-Glove Partner: Delhivery
            </span>
          </div>

          <div className="p-5 space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-border bg-background space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary">
                      Order #{order.orderNumber}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Customer: {order.customerName} &bull; Destination: {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      Status: {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif font-bold text-sm text-foreground">
                      {order.items[0]?.artworkTitle || 'Original Painting'}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Packaging: Archival PVC Tube with COA Slip Insert
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-base text-foreground">
                      {formatINR(order.total)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      Held in Escrow (7 Days)
                    </p>
                  </div>
                </div>

                {/* Scheduled Dispatch Controls */}
                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    <span>Courier Pickup Window: Scheduled for 2:00 PM &ndash; 5:00 PM Tomorrow</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.orderStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'PACKING_IN_PROGRESS')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/20 transition"
                      >
                        Start Packing in Tube
                      </button>
                    )}
                    {order.orderStatus === 'PACKING_IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'PICKUP_SCHEDULED')}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                      >
                        Confirm Packed &amp; Request Courier
                      </button>
                    )}
                    {order.orderStatus === 'PICKUP_SCHEDULED' && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Courier Dispatched to Studio
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LEDGER VIEW */}
      {activeTab === 'ledger' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-foreground">
              Earnings &amp; Split Settlement Ledger
            </h3>
            <span className="text-xs text-muted-foreground">
              Automated transfers via Razorpay Route upon inspection clearance.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Gross Sale</th>
                  <th className="py-3 px-4">Platform Fee (20%)</th>
                  <th className="py-3 px-4">TDS (1%)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{p.orderId}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold">{formatINR(p.grossSaleAmount)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{formatINR(p.platformCommissionAmount)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{formatINR(p.tdsAmount)}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-primary">
                      {formatINR(p.netPayoutAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'TRANSFERRED' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          Settled to Bank
                        </span>
                      )}
                      {p.status === 'HELD_IN_ESCROW' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          Held (7-Day Window)
                        </span>
                      )}
                      {p.status === 'READY_FOR_SETTLEMENT' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300">
                          Cleared for Payout
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
