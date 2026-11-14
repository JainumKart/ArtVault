'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/utils';
import { standardFramingOptions } from '@/lib/mock-data';
import { X, Trash2, ShieldCheck, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { items, itemCount, subtotal, taxGst, shippingFee, total, isCartOpen, closeCart, removeItem, updateFraming } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Your Acquisition Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-base font-semibold text-foreground">Your gallery cart is empty</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                  Explore original paintings, certified limited prints, and contemporary sculptures from premier artists.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-5 px-5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                >
                  Explore Artworks
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 bg-background border border-border rounded-xl space-y-3 relative group"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.artworkImage}
                      alt={item.artworkTitle}
                      className="w-20 h-20 object-cover rounded-lg border border-border shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-serif font-bold text-foreground truncate">
                          {item.artworkTitle}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition p-0.5"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">By {item.artistName}</p>
                      <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground border border-border">
                        {item.variantType === 'ORIGINAL' ? (
                          <span className="text-primary font-semibold">1-of-1 Original</span>
                        ) : (
                          <span>
                            Limited Print {item.editionNumber ? `(#${item.editionNumber})` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Framing Selector Dropdown */}
                  <div className="pt-2 border-t border-border/60">
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Mount & Framing Selection:
                    </label>
                    <select
                      value={item.selectedFraming?.id || 'unframed'}
                      onChange={e => {
                        const match = standardFramingOptions.find(f => f.id === e.target.value);
                        if (match) updateFraming(item.id, match);
                      }}
                      className="w-full text-xs bg-muted/40 border border-input rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {standardFramingOptions.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name} {f.priceDelta > 0 ? `(+${formatINR(f.priceDelta)})` : '(Included)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing line */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Artwork + Frame:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {formatINR(item.totalItemPrice)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-muted/20 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (12% Art Goods & Services)</span>
                  <span className="font-mono text-foreground">{formatINR(taxGst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-primary" /> White-Glove Scheduled Art Courier
                  </span>
                  <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="font-mono text-primary text-base">{formatINR(total)}</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Certificate of Authenticity & 7-Day Inspection Escrow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
