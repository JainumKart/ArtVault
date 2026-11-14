'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockOrders, mockArtworks } from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/utils';
import { STYLE_CLASSES } from '@/constants';
import {
  User as UserIcon,
  ShieldCheck,
  Package,
  MapPin,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, role, setRole, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'vault' | 'orders' | 'addresses'>('vault');

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-foreground">Sign In to View Collector Vault</h2>
        <p className="text-xs text-muted-foreground">
          Access your acquired artworks, digital certificates of authenticity, and saved addresses.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs"
        >
          Sign In / Join
        </button>
      </div>
    );
  }

  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-10 space-y-8"}>
      {/* Profile Header */}
      <div className="bg-card dark:bg-card/85 border border-border dark:border-purple-900/30 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-muted dark:border-purple-900/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {user.name}
              </h1>
              <span className={STYLE_CLASSES.badges.printPurple}>
                {role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.email} &bull; {user.phone}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mobile OTP Verified
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> RBI Escrow Active
              </span>
            </div>
          </div>
        </div>

        {/* Persona quick switch */}
        <div className="flex items-center gap-2 bg-muted/40 dark:bg-slate-900/50 p-2 rounded-2xl border border-border dark:border-purple-900/30 text-xs">
          <span className="text-muted-foreground px-2">Role:</span>
          {(['COLLECTOR', 'ARTIST', 'ADMIN'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-xl transition font-semibold capitalize ${
                role === r
                  ? 'bg-card text-primary dark:text-purple-300 shadow-xs ring-1 ring-primary/20 dark:ring-purple-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'vault'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Certificate of Authenticity (COA) Vault
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="w-4 h-4" />
          Acquisition History &amp; Tracking ({mockOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'border-primary dark:border-purple-500 text-primary dark:text-purple-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Saved Delivery Addresses
        </button>
      </div>

      {/* TAB 1: COA VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              Your acquired artworks are permanently secured in the ArtVault Provenance Registry.
              Each Certificate of Authenticity contains an immutable cryptographic verification hash and can be presented for insurance, gallery consignment, or secondary resale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArtworks.slice(0, 2).map((art, index) => (
              <div
                key={art.id}
                className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className="w-20 h-20 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Verified Provenance
                    </span>
                    <h3 className="font-serif font-bold text-base text-foreground">
                      {art.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      by {art.artistName} &bull; {art.medium}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      Token: {art.certificateOfAuthenticity.tokenNumber}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Signed by Artist
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Printing official provenance certificate for ${art.title}`)}
                      className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Print certificate"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Certificate PDF downloaded for ${art.title}`)}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-1 shadow-xs hover:bg-primary/90 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download COA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {mockOrders.map(order => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <span className="text-xs font-mono font-bold text-primary">
                    Order #{order.orderNumber}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed on {formatDate(order.createdAt)} &bull; Destination: {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    Status: {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="font-serif font-bold text-base text-foreground">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={order.items[0]?.artworkImage}
                    alt={order.items[0]?.artworkTitle}
                    className="w-14 h-14 rounded-xl object-cover border border-border"
                  />
                  <div>
                    <p className="font-serif font-bold text-sm text-foreground">
                      {order.items[0]?.artworkTitle}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      by {order.items[0]?.artistName} &bull; {order.items[0]?.framingName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    href={`/order-success?orderId=${order.orderNumber}`}
                    className="text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    View Tracking &amp; COA <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.savedAddresses?.map(addr => (
            <div
              key={addr.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                    Default Delivery
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {addr.streetAddress}, {addr.apartment}<br />
                {addr.city}, {addr.state} - {addr.postalCode}<br />
                {addr.country} &bull; Phone: {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
