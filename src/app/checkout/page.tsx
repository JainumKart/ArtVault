'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Info,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, taxGst, shippingFee, total, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();

  // Address form state
  const defaultAddress = user?.savedAddresses?.[0];
  const [fullName, setFullName] = useState(defaultAddress?.fullName || user?.name || 'Devika Sharma');
  const [phone, setPhone] = useState(defaultAddress?.phone || user?.phone || '9820154321');
  const [streetAddress, setStreetAddress] = useState(
    defaultAddress?.streetAddress || 'Flat 902, Lodha Bellissimo, NM Joshi Marg'
  );
  const [apartment, setApartment] = useState(defaultAddress?.apartment || 'Tower B, 9th Floor');
  const [city, setCity] = useState(defaultAddress?.city || 'Mumbai');
  const [stateName, setStateName] = useState(defaultAddress?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(defaultAddress?.postalCode || '400011');

  // Payment selection state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState('devika@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Your acquisition cart is empty</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Explore our collection of authentic 1-of-1 fine art originals and certified limited edition prints.
        </p>
        <Link
          href="/artworks"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Razorpay Indian Gateway Workflow
    setPaymentStep('Connecting to Razorpay Route Gateway...');
    await new Promise(r => setTimeout(r, 800));

    setPaymentStep('Authenticating via RBI 3D Secure / UPI Intent...');
    await new Promise(r => setTimeout(r, 900));

    setPaymentStep('Creating Escrow Hold & Scheduling Studio Courier Pickup...');
    await new Promise(r => setTimeout(r, 900));

    // Clear cart and redirect
    const generatedOrderNumber = `AV-${Date.now().toString().slice(-6)}`;
    clearCart();
    router.push(`/order-success?orderId=${generatedOrderNumber}`);
  };

  const indianStates = [
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Secure Settlement</span>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
            Acquisition Checkout &amp; White-Glove Dispatch
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full font-semibold border border-emerald-500/20">
          <Lock className="w-3.5 h-3.5" /> 256-Bit SSL &bull; Razorpay Route Escrow
        </div>
      </div>

      <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Address & Payment Method (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Indian Shipping Address */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                1. Delivery &amp; White-Glove Unpacking Address
              </h3>
              <span className="text-[11px] text-muted-foreground">Domestic India Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">10-Digit Mobile Number (for Courier)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-foreground block mb-1">Street Address / Society Name</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Flat / Floor / Landmark (Optional)</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">State</label>
                <select
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                >
                  {indianStates.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">PIN Code (6 digits)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Scheduled Courier Pickup Notice */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs">
              <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Scheduled White-Glove Studio Pickup</p>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  Upon payment, courier scheduled pickup will be booked with Delhivery/BlueDart Art Logistics.
                  Estimated delivery to {city}: <strong>3 &ndash; 5 business days</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Indian Payment Gateways */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                2. Payment Gateway (India Supported)
              </h3>
              <span className="text-[11px] text-muted-foreground">Powered by Razorpay</span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">UPI (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Cards / RuPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>

            {/* UPI Tab */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    UPI ID / VPA (e.g. mobile@upi, gpay, phonepe)
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                  <span>Supported apps:</span>
                  <span className="font-semibold text-foreground">Google Pay</span>
                  <span className="font-semibold text-foreground">PhonePe</span>
                  <span className="font-semibold text-foreground">Paytm</span>
                  <span className="font-semibold text-foreground">BHIM UPI</span>
                </div>
              </div>
            )}

            {/* Card Tab */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Domestic RuPay, Visa, Mastercard, and Diners cards accepted with OTP 3D-Secure.
                </p>
              </div>
            )}

            {/* NetBanking Tab */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3 text-xs">
                <label className="font-semibold text-foreground block mb-1">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Escrow Trust Strip */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-serif font-bold text-emerald-950 dark:text-emerald-100">
                  RBI-Compliant 7-Day Escrow Protection
                </p>
                <p className="text-emerald-800 dark:text-emerald-300/80 mt-0.5 leading-relaxed text-[11px]">
                  Your settlement is securely held in an escrow account. The artist is paid only after you inspect the original artwork and approve authenticity within 7 calendar days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Settlement Button (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm sticky top-24">
            <h3 className="font-serif font-bold text-base text-foreground pb-3 border-b border-border">
              Acquisition Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.artworkImage}
                    alt={item.artworkTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-foreground truncate">{item.artworkTitle}</p>
                    <p className="text-muted-foreground text-[11px] truncate">by {item.artistName}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {item.variantTitle} &bull; {item.selectedFraming?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatINR(item.totalItemPrice)}
                    </p>
                    <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Ledger Calculation */}
            <div className="pt-4 border-t border-border space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Artwork Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (12% under HSN 9701)</span>
                <span>{formatINR(taxGst)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>White-Glove Scheduled Pickup &amp; Transit</span>
                <span>{shippingFee === 0 ? 'FREE (Orders > ₹15,000)' : formatINR(shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-primary">{formatINR(total)}</span>
              </div>
            </div>

            {/* Submit Payment Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    {paymentStep}
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay {formatINR(total)} via Razorpay
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              By acquiring, you agree to the ArtVault Collector Escrow &amp; Certificate Terms.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
