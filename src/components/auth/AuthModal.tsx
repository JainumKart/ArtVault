'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, Smartphone, Mail, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendEmailOtp,
    verifyEmailOtp,
    loginWithOAuth,
    role,
    setRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'social'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9820154321');
  const [emailAddress, setEmailAddress] = useState('devika@artvault.in');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [helperNotice, setHelperNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setIsLoading(true);
    const res = await sendPhoneOtp(phoneNumber);
    setIsLoading(false);
    setHelperNotice(`OTP sent successfully! Demo verification code: ${res.demoOtp}`);
    setOtpCode(res.demoOtp);
    setStep('otp');
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const success = await verifyPhoneOtp(phoneNumber, otpCode);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Invalid OTP. Please enter 123456.');
    }
  };

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!emailAddress || !emailAddress.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    const res = await sendEmailOtp(emailAddress);
    setIsLoading(false);
    setHelperNotice(`Verification code sent! Demo code: ${res.demoOtp}`);
    setOtpCode(res.demoOtp);
    setStep('otp');
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const success = await verifyEmailOtp(emailAddress, otpCode);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Invalid code. Please enter 654321.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'instagram') => {
    setIsLoading(true);
    await loginWithOAuth(provider);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden bg-card border border-border rounded-2xl shadow-2xl">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-900/10 via-amber-800/5 to-transparent p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Art<span className="text-primary italic">Vault</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                Secure Auth
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Sign in to collect authentic masterpieces, issue Certificates of Authenticity, or manage your artist studio.
          </p>

          {/* Quick Demo Role Switcher */}
          <div className="mt-4 pt-3 border-t border-border/60">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> Instant Persona Preview:
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-muted/60 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('COLLECTOR')}
                className={`py-1 text-xs font-medium rounded-md transition ${
                  role === 'COLLECTOR'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Collector
              </button>
              <button
                type="button"
                onClick={() => setRole('ARTIST')}
                className={`py-1 text-xs font-medium rounded-md transition ${
                  role === 'ARTIST'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Artist
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-1 text-xs font-medium rounded-md transition ${
                  role === 'ADMIN'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-muted/30">
          <button
            onClick={() => {
              setActiveTab('phone');
              setStep('input');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'phone'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Phone OTP
          </button>
          <button
            onClick={() => {
              setActiveTab('email');
              setStep('input');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'email'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email OTP
          </button>
          <button
            onClick={() => {
              setActiveTab('social');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'social'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Social OAuth
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {errorMsg}
            </div>
          )}

          {helperNotice && (
            <div className="mb-4 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{helperNotice}</span>
            </div>
          )}

          {/* TAB 1: PHONE OTP */}
          {activeTab === 'phone' && (
            <div>
              {step === 'input' ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Indian Mobile Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-lg font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98200 12345"
                        className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
                        required
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      We will send a 6-digit verification code via Indian SMS Gateway.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? 'Sending SMS OTP...' : 'Send Verification OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Enter 6-Digit SMS OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2.5 text-center text-lg tracking-widest bg-background border border-input rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-muted-foreground">Sent to +91 {phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => setStep('input')}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP & Enter Gallery'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL OTP */}
          {activeTab === 'email' && (
            <div>
              {step === 'input' ? (
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Collector / Artist Email
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={e => setEmailAddress(e.target.value)}
                      placeholder="collector@artvault.in"
                      className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Passwordless login: we send a secure one-time passkey to your email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? 'Sending Passkey...' : 'Send Email Passkey'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Enter 6-Digit Email Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="654321"
                      className="w-full px-3 py-2.5 text-center text-lg tracking-widest bg-background border border-input rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-muted-foreground">Sent to {emailAddress}</span>
                      <button
                        type="button"
                        onClick={() => setStep('input')}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Change Email
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                  >
                    {isLoading ? 'Verifying...' : 'Authenticate & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SOCIAL OAUTH */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted transition flex items-center justify-center gap-3 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-lg border border-border bg-[#1877F2] text-white hover:bg-[#166fe5] transition flex items-center justify-center gap-3 shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('instagram')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 transition flex items-center justify-center gap-3 shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Continue with Instagram
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground border-t border-border pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Indian RBI & DPDP Act Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
