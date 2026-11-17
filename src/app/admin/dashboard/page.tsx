'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  mockOrders,
  mockArtists,
  mockArtworks,
  mockPayouts,
} from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/utils';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
import {
  Shield,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Truck,
  FileCheck,
  AlertTriangle,
  Sliders,
  Lock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, role, setRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'artists' | 'curation' | 'settings'>('overview');
  const [artists, setArtists] = useState(mockArtists);
  const [defaultCommission, setDefaultCommission] = useState<number>(APP_CONFIG.financial.defaultCommissionPercent);
  const [searchQuery, setSearchQuery] = useState('');

  // Enforce Authorization: Never render sensitive GMV or orders if not authenticated as ADMIN
  if (!user || role !== 'ADMIN') {
    return (
      <div className={STYLE_CLASSES.layout.pageContainer + " py-20"}>
        <div className="max-w-xl mx-auto bg-card border border-border dark:border-purple-900/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={STYLE_CLASSES.typography.eyebrow}>Restricted Area</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Curator &amp; Admin Desk
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This internal portal manages platform settlements, RBI escrow fund releases, artist KYC approvals, and sensitive customer order records. Role-based administrator authorization is strictly enforced.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
            Current status:{' '}
            <span className="font-semibold text-foreground">
              {user ? `Signed in as ${user.name} (${role})` : 'Unauthenticated Visitor'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setRole('ADMIN')}
              className={STYLE_CLASSES.buttons.primary + " w-full sm:w-auto px-6 py-3 text-xs"}
            >
              Sign in with Demo Admin Account
            </button>
            <Link
              href="/artworks"
              className={STYLE_CLASSES.buttons.secondary + " w-full sm:w-auto px-6 py-3 text-xs"}
            >
              Back to Public Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const gmv = mockOrders.reduce((acc, o) => acc + o.total, 0) + 450000;
  const platformRevenue = gmv * (defaultCommission / 100);
  const pendingEscrow = 142000;

  const handleApproveArtist = (artistId: string) => {
    setArtists(
      artists.map(a =>
        a.id === artistId ? { ...a, kycStatus: 'VERIFIED' as const } : a
      )
    );
  };

  const handleRejectArtist = (artistId: string) => {
    setArtists(
      artists.map(a =>
        a.id === artistId ? { ...a, kycStatus: 'REJECTED' as const } : a
      )
    );
  };

  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-10 space-y-8"}>
      {/* Top Header */}
      <div className="bg-card dark:bg-card/85 border border-border dark:border-purple-900/30 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-center font-serif text-2xl font-bold">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                ArtVault Curator &amp; Platform Command Desk
              </h1>
              <span className={STYLE_CLASSES.badges.printPurple}>
                Super Admin
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Platform Transaction Monitor &bull; Escrow Settlements &bull; Artist KYC Screening &bull; TDS Compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Global Marketplace Cut</span>
            <span className="font-serif text-lg font-bold text-foreground">{defaultCommission}% Commission</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card dark:bg-card/80 border border-border dark:border-purple-900/30 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Gross Merchandise Value (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-foreground">{formatINR(gmv)}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+24.5% vs previous quarter</p>
        </div>

        <div className="bg-card dark:bg-gradient-to-br dark:from-purple-950/20 dark:to-blue-950/20 border border-primary/20 dark:border-purple-500/30 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 text-xs font-bold">
            <span>Net Platform Commission</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl font-bold text-purple-800 dark:text-purple-200">
            {formatINR(platformRevenue)}
          </p>
          <p className="text-[11px] text-muted-foreground">Calculated at {defaultCommission}% take rate</p>
        </div>

        <div className="bg-card dark:bg-card/80 border border-border dark:border-purple-900/30 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Funds Held in Escrow</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-foreground">{formatINR(pendingEscrow)}</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pending {APP_CONFIG.financial.escrowHoldingDays}-day inspection release</p>
        </div>

        <div className="bg-card dark:bg-card/80 border border-border dark:border-purple-900/30 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Vetted Artists</span>
            <Users className="w-4 h-4 text-primary dark:text-purple-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-foreground">{artists.length} Masters</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% PAN &amp; Bank Verified</p>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-3 border-b border-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Marketplace Transactions ({mockOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'artists'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Artist KYC &amp; Onboarding Approvals ({artists.length})
        </button>

        <button
          onClick={() => setActiveTab('curation')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'curation'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Artwork Moderation Queue ({mockArtworks.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Commission Tiers &amp; Gateway Settings
        </button>
      </div>

      {/* TAB 1: ALL TRANSACTIONS */}
      {activeTab === 'overview' && (
        <div className={STYLE_CLASSES.tables.container}>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-foreground">
                All Customer Orders &amp; Razorpay Split Payouts
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full ledger breakdown of order amounts, marketplace fee, and artist escrow transfers.
              </p>
            </div>
          </div>

          <table className={STYLE_CLASSES.tables.table}>
            <thead className={STYLE_CLASSES.tables.thead}>
              <tr>
                <th className={STYLE_CLASSES.tables.th}>Order ID</th>
                <th className={STYLE_CLASSES.tables.th}>Collector</th>
                <th className={STYLE_CLASSES.tables.th}>Artwork Item</th>
                <th className={STYLE_CLASSES.tables.th}>Order Value</th>
                <th className={STYLE_CLASSES.tables.th}>Platform Fee ({defaultCommission}%)</th>
                <th className={STYLE_CLASSES.tables.th}>Courier Status</th>
                <th className={STYLE_CLASSES.tables.th}>Escrow Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => {
                const comm = order.total * (defaultCommission / 100);
                return (
                  <tr key={order.id} className={STYLE_CLASSES.tables.row}>
                    <td className={STYLE_CLASSES.tables.td + " font-mono font-bold text-foreground"}>
                      #{order.orderNumber}
                    </td>
                    <td className={STYLE_CLASSES.tables.td}>
                      <p className="font-semibold text-foreground">{order.customerName}</p>
                      <p className="text-muted-foreground text-[11px]">{order.shippingAddress.city}</p>
                    </td>
                    <td className={STYLE_CLASSES.tables.td + " text-foreground font-serif"}>
                      {order.items[0]?.artworkTitle}
                    </td>
                    <td className={STYLE_CLASSES.tables.td + " font-serif font-bold text-foreground"}>
                      {formatINR(order.total)}
                    </td>
                    <td className={STYLE_CLASSES.tables.td + " font-semibold text-purple-700 dark:text-purple-300"}>
                      {formatINR(comm)}
                    </td>
                    <td className={STYLE_CLASSES.tables.td}>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className={STYLE_CLASSES.tables.td}>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        Razorpay Route Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ARTIST KYC APPROVALS */}
      {activeTab === 'artists' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-foreground">
                Artist Verification &amp; Tax KYC Desk
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vetting Indian artists for authenticity, verifying PAN card numbers, and clearing payouts.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {artists.map(artist => (
              <div key={artist.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.displayName}
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-foreground">
                        {artist.displayName}
                      </h4>
                      {artist.kycStatus === 'VERIFIED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          PENDING REVIEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {artist.location} &bull; PAN: <code>ABCDE1234F</code> &bull; Bank: HDFC (IFSC: HDFC0000123)
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      Exhibited at: {artist.exhibitions[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {artist.kycStatus !== 'VERIFIED' ? (
                    <button
                      onClick={() => handleApproveArtist(artist.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Verify KYC
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRejectArtist(artist.id)}
                      className="px-3.5 py-2 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 text-xs font-semibold transition"
                    >
                      Suspend Artist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARTWORK MODERATION */}
      {activeTab === 'curation' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-foreground">
              Marketplace Artwork Curation Queue
            </h3>
            <span className="text-xs text-muted-foreground">
              Reviewing authenticity, image quality, and pricing.
            </span>
          </div>

          <div className="divide-y divide-border">
            {mockArtworks.map(art => (
              <div key={art.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-foreground">{art.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {art.artistName} &bull; {art.medium} &bull; Created {art.year}
                    </p>
                    <p className="text-xs text-foreground font-serif font-bold mt-1">
                      {formatINR(art.originalPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Live on Marketplace
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & COMMISSION TIERS */}
      {activeTab === 'settings' && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <div className="border-b border-border pb-4">
            <h3 className="font-serif font-bold text-lg text-foreground">
              Marketplace Commission &amp; Settlement Controls
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure global platform fee splits and Indian statutory compliance rules.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Standard Platform Commission Split (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={defaultCommission}
                  onChange={e => setDefaultCommission(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-serif font-bold text-lg text-primary min-w-[50px]">
                  {defaultCommission}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Saatchi Art charges 35-40%. ArtVault standard is set to 20% to empower independent Indian artists.
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <span className="font-semibold text-foreground block">TDS Section 194-O Compliance</span>
              <p className="text-muted-foreground leading-relaxed">
                Platform automatically withholds 1% TDS on the gross sales value on all electronic commerce transactions involving Indian resident artists, auto-populating quarterly Form 26AS.
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <span className="font-semibold text-foreground block">Automated Courier Dispatch Integration</span>
              <p className="text-muted-foreground leading-relaxed">
                Connected carrier: <strong>Delhivery Fine Art &amp; BlueDart Air</strong>. Studio pickups auto-triggered once artist marks status as &ldquo;Packing in Progress&rdquo;.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
