'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockOrders, mockArtworks } from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/utils';
import { STYLE_CLASSES, APP_CONFIG } from '@/constants';
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
  Lock,
  ArrowRight,
  Database,
} from 'lucide-react';

export default function CollectorVaultPage() {
  const { user, role, openAuthModal, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'vault' | 'orders' | 'addresses'>('vault');
  const [selectedCoaModal, setSelectedCoaModal] = useState<any | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>(mockOrders);
  const [isLiveOrders, setIsLiveOrders] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load any orders cached in localStorage
    let combinedOrders = [...mockOrders];
    try {
      const stored = localStorage.getItem('artvault_local_orders');
      if (stored) {
        const localList = JSON.parse(stored);
        if (Array.isArray(localList) && localList.length > 0) {
          combinedOrders = [...localList, ...mockOrders.filter(mo => !localList.some(lo => lo.orderNumber === mo.orderNumber))];
          setUserOrders(combinedOrders);
          setIsLiveOrders(true);
        }
      }
    } catch {}

    // Fetch from database API
    fetch(`/api/orders?userId=${user.id}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const dbOrders = resData.data;
          // Merge db orders with combinedOrders
          const merged = [...dbOrders];
          for (const co of combinedOrders) {
            if (!merged.some(m => m.orderNumber === co.orderNumber)) {
              merged.push(co);
            }
          }
          setUserOrders(merged);
          setIsLiveOrders(true);
        }
      })
      .catch(err => console.warn('Could not fetch user orders from DB:', err));
  }, [user]);

  if (!user) {
    return (
      <div className={STYLE_CLASSES.layout.pageContainer + " py-20"}>
        <div className="max-w-xl mx-auto bg-card border border-border dark:border-purple-900/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:bg-purple-500/15 dark:text-purple-300 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={STYLE_CLASSES.typography.eyebrow}>Collector Portal</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Sign In to Your Collector Vault
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Access your acquired originals, cryptographically signed Certificates of Authenticity, live escrow inspection tracking, and delivery addresses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('signin')}
              className={STYLE_CLASSES.buttons.primary + " w-full sm:w-auto px-6 py-3 text-xs"}
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className={STYLE_CLASSES.buttons.secondary + " w-full sm:w-auto px-6 py-3 text-xs"}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Acquired artworks mock for this collector
  const acquiredArtworks = mockArtworks.slice(0, 2);

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
                {user.role}
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

        {/* Account controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-2 transition flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'text-primary dark:text-purple-400 border-b-2 border-primary dark:border-purple-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Acquired Art &amp; COA Tokens ({acquiredArtworks.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-primary dark:text-purple-400 border-b-2 border-primary dark:border-purple-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="w-4 h-4" />
          Escrow Orders &amp; Transit ({userOrders.length})
          {isLiveOrders && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Database Synced" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-2 transition flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-primary dark:text-purple-400 border-b-2 border-primary dark:border-purple-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Saved Delivery Addresses ({user.savedAddresses?.length || 1})
        </button>
      </div>

      {/* Tab 1: Acquired Artworks & COA Tokens */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acquiredArtworks.map(artwork => (
              <div
                key={artwork.id}
                className="bg-card border border-border dark:border-purple-900/30 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={artwork.images[0]}
                    alt={artwork.title}
                    className="w-24 h-28 object-cover rounded-xl border border-border"
                  />
                  <div className="space-y-1 flex-1">
                    <span className={STYLE_CLASSES.badges.originalGold}>
                      1-of-1 Original Acquired
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      By {artwork.artistName} &bull; {artwork.medium}
                    </p>
                    <div className="pt-2 text-xs font-mono text-primary dark:text-purple-400 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{artwork.certificateOfAuthenticity.tokenNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground">Appraised Value:</span>
                    <p className="font-serif font-bold text-foreground">{formatINR(artwork.originalPrice)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCoaModal(artwork)}
                    className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    Inspect COA Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Escrow Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div
              key={order.id}
              className="bg-card border border-border dark:border-purple-900/30 rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Order ID: </span>
                  <span className="font-mono font-bold text-foreground">{order.orderNumber}</span>
                  <span className="text-muted-foreground ml-3">&bull; Placed: {formatDate(order.paymentDetails.paymentTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={STYLE_CLASSES.badges.verifiedGreen}>
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-muted-foreground">&bull; Courier: {order.scheduledPickup?.courierPartner || 'Delhivery Art Logistics'}</span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.artworkImage}
                        alt={item.artworkTitle}
                        className="w-12 h-14 object-cover rounded-lg border border-border"
                      />
                      <div>
                        <p className="font-serif font-bold text-sm text-foreground">{item.artworkTitle}</p>
                        <p className="text-muted-foreground">By {item.artistName} &bull; {item.variantTitle}</p>
                        {item.framingName && (
                          <p className="text-[11px] text-muted-foreground">Framing: {item.framingName}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-serif font-bold text-foreground">{formatINR(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow Active: ₹{order.total.toLocaleString('en-IN')} held until inspection complete</span>
                </div>
                <p className="font-serif font-bold text-sm text-foreground">Total: {formatINR(order.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="max-w-xl bg-card border border-border dark:border-purple-900/30 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-foreground">Primary Delivery Address</h3>
            <span className="text-xs bg-primary/10 text-primary dark:text-purple-400 px-2.5 py-0.5 rounded-full font-semibold">
              Default
            </span>
          </div>

          <div className="text-xs space-y-1 text-muted-foreground">
            <p className="font-bold text-foreground">{user.savedAddresses?.[0]?.fullName || user.name}</p>
            <p>{user.savedAddresses?.[0]?.streetAddress || 'Flat 902, Lodha Bellissimo'}</p>
            <p>{user.savedAddresses?.[0]?.apartment || 'Tower B, 9th Floor'}</p>
            <p>
              {user.savedAddresses?.[0]?.city || 'Mumbai'}, {user.savedAddresses?.[0]?.state || 'Maharashtra'} -{' '}
              {user.savedAddresses?.[0]?.postalCode || '400011'}
            </p>
            <p>Phone: {user.phone}</p>
          </div>
        </div>
      )}

      {/* Modal: COA Full Inspector */}
      {selectedCoaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border dark:border-purple-900/50 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2 border-b border-border pb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Certificate of Authenticity
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                Registry ID: {selectedCoaModal.certificateOfAuthenticity.tokenNumber}
              </p>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Artwork:</span>
                <span className="font-bold text-foreground">{selectedCoaModal.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Artist:</span>
                <span className="font-bold text-foreground">{selectedCoaModal.artistName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Medium:</span>
                <span className="font-bold text-foreground">{selectedCoaModal.medium}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Edition:</span>
                <span className="font-bold text-foreground">1-of-1 Original Canvas</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Issue Date:</span>
                <span className="font-bold text-foreground">
                  {new Date(selectedCoaModal.certificateOfAuthenticity.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Curator Counter-signature:</span>
                <span className="font-semibold text-emerald-600">VERIFIED AUTHENTIC</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedCoaModal(null)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
