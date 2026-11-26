'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ArtistProfile } from '@/types';

export interface StoredAccount extends User {
  password?: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'COLLECTOR' | 'ARTIST';
  city?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'signin' | 'signup';
  authTargetRole: UserRole;
  activeArtistProfile: ArtistProfile | null;
  openAuthModal: (view?: 'signin' | 'signup', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; demoOtp: string; error?: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; demoOtp: string; error?: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'instagram') => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  setRole: (role: UserRole) => void;
}

// Demo accounts used by the local authentication flow.
export const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'user-admin-root',
    name: 'ArtVault Admin',
    email: 'admin@artvault.in',
    password: 'AdminPassword123!',
    phone: '+91 90000 00001',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'user-artist-pragya',
    name: 'Pragya Jain',
    email: 'pragya@artvault.in',
    password: 'PragyaPassword123!',
    phone: '+91 90000 00002',
    role: 'ARTIST',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2023-11-20T00:00:00Z',
  },
  {
    id: 'user-collector-kartik',
    name: 'Kartik Jain',
    email: 'kartik@artvault.in',
    password: 'KartikPassword123!',
    phone: '+91 90000 00003',
    role: 'COLLECTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isPhoneVerified: true,
    isEmailVerified: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
];

const LEGACY_SEED_EMAILS = [
  'artist@artvault.in',
  'vikramaditya@artvault.in',
  'zubin@artvault.in',
  'collector@artvault.in',
];

const normalizeIndianPhone = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  const nationalNumber = digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(nationalNumber) ? nationalNumber : null;
};

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const STORAGE_KEYS = {
  SESSION: 'artvault_active_session',
  ACCOUNTS: 'artvault_registered_accounts',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('COLLECTOR');
  const [activeArtistProfile, setActiveArtistProfile] = useState<ArtistProfile | null>(null);

  // Helper: Retrieve all stored accounts (seeded + registered)
  const getStoredAccounts = (): StoredAccount[] => {
    if (typeof window === 'undefined') return SEED_ACCOUNTS;
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      saveStoredAccounts(SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        saveStoredAccounts(SEED_ACCOUNTS);
        return SEED_ACCOUNTS;
      }
      const seedEmails = new Set([
        ...SEED_ACCOUNTS.map(account => account.email),
        ...LEGACY_SEED_EMAILS,
      ]);
      const accounts = [
        ...parsed.filter(
          (account): account is StoredAccount =>
            account && typeof account.email === 'string' && !seedEmails.has(account.email.toLowerCase())
        ),
        ...SEED_ACCOUNTS,
      ];
      saveStoredAccounts(accounts);
      return accounts;
    } catch {
      saveStoredAccounts(SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }
  };

  // Helper: Save accounts list
  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  };

  // Initialize session on mount
  useEffect(() => {
    getStoredAccounts();
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (rawSession) {
      try {
        const sessionUser: User = JSON.parse(rawSession);
        const seededAccount = SEED_ACCOUNTS.find(
          account => account.email.toLowerCase() === sessionUser.email.toLowerCase()
        );
        if (seededAccount) {
          const { password: _, ...updatedSession } = seededAccount;
          setUser(updatedSession);
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
        } else if (LEGACY_SEED_EMAILS.includes(sessionUser.email.toLowerCase())) {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
          setUser(null);
        } else {
          setUser(sessionUser);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        setUser(null);
      }
    } else {
      // Default to logged-out state
      setUser(null);
    }
  }, []);

  // Sync active artist profile when role changes
  useEffect(() => {
    if (user?.role === 'ARTIST') {
      setActiveArtistProfile(null);
      let isCurrent = true;
      fetch(`/api/artists/${encodeURIComponent(user.id)}`)
        .then(res => res.json())
        .then(resData => {
          if (!isCurrent || !resData.success || !resData.data) return;
          const profile = resData.data;
          setActiveArtistProfile({
            id: profile.id,
            userId: profile.userId,
            displayName: profile.displayName,
            slug: profile.slug,
            bio: profile.bio,
            statement: profile.statement,
            avatarUrl: profile.avatarUrl || user.avatarUrl,
            bannerUrl: profile.bannerUrl || '',
            location: profile.location,
            exhibitions: profile.exhibitions || [],
            commissionRate: profile.commissionRate,
            kycStatus: profile.kycStatus,
            totalSales: profile.totalSales,
            rating: profile.rating,
            artworkCount: profile.artworks?.length || 0,
            joinedDate: profile.createdAt,
          });
        })
        .catch(error => {
          if (isCurrent) console.error('Could not fetch artist studio profile:', error);
        });
      return () => {
        isCurrent = false;
      };
    } else {
      setActiveArtistProfile(null);
    }
  }, [user]);

  const openAuthModal = (view: 'signin' | 'signup' = 'signin', defaultRole: UserRole = 'COLLECTOR') => {
    setAuthModalView(view);
    setAuthTargetRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Email & Password Authentication
  const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const matched = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (matched.password && matched.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Strip password from active session user object
    const { password: _, ...sessionUser } = matched;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // User Registration (Sign Up)
  const signUp = async (params: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = params.email.trim().toLowerCase();
    const normalizedPhone = normalizeIndianPhone(params.phone);
    if (!params.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!isValidEmail(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!normalizedPhone) {
      return { success: false, error: 'Please provide a valid 10-digit mobile number.' };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }
    if (accounts.some(account => normalizeIndianPhone(account.phone) === normalizedPhone)) {
      return { success: false, error: 'An account with this mobile number already exists. Please sign in.' };
    }

    const newUser: StoredAccount = {
      id: `user-${Date.now()}`,
      name: params.name.trim(),
      email: cleanEmail,
      phone: `+91 ${normalizedPhone}`,
      password: params.password,
      role: params.role, // 'COLLECTOR' | 'ARTIST'
      avatarUrl:
        params.role === 'ARTIST'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      savedAddresses: params.city
        ? [
            {
              id: `addr-${Date.now()}`,
              fullName: params.name.trim(),
              phone: params.phone,
              streetAddress: 'Studio Residence',
              city: params.city,
              state: 'India',
              postalCode: '400001',
              country: 'India',
              isDefault: true,
            },
          ]
        : [],
    };

    const updatedAccounts = [...accounts, newUser];
    saveStoredAccounts(updatedAccounts);

    // Save active session
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Phone OTP dispatch simulation
  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; demoOtp: string; error?: string }> => {
    if (!normalizeIndianPhone(phone)) {
      return { success: false, demoOtp: '', error: 'Please enter a valid 10-digit mobile number.' };
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '123456' });
      }, 500);
    });
  };

  // Phone OTP verification
  const verifyPhoneOtp = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    if (otp !== '123456') {
      return { success: false, error: 'Invalid verification code. Please enter 123456.' };
    }

    const cleanPhone = normalizeIndianPhone(phone);
    if (!cleanPhone) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    const accounts = getStoredAccounts();
    const matched = accounts.find(a => normalizeIndianPhone(a.phone) === cleanPhone);

    if (matched) {
      const { password: _, ...sessionUser } = matched;
      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
      closeAuthModal();
      return { success: true };
    }

    // Auto-create a collector profile for this verified phone number
    const newUser: StoredAccount = {
      id: `user-phone-${Date.now()}`,
      name: `Collector ${cleanPhone.slice(-4)}`,
      email: `collector.${cleanPhone.slice(-4)}@artvault.in`,
      phone: `+91 ${cleanPhone}`,
      role: 'COLLECTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: true,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newUser]);
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Email OTP dispatch simulation
  const sendEmailOtp = async (email: string): Promise<{ success: boolean; demoOtp: string; error?: string }> => {
    if (!isValidEmail(email.trim())) {
      return { success: false, demoOtp: '', error: 'Please enter a valid email address.' };
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, demoOtp: '654321' });
      }, 500);
    });
  };

  // Email OTP verification
  const verifyEmailOtp = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    if (otp !== '654321') {
      return { success: false, error: 'Invalid verification code. Please enter 654321.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const accounts = getStoredAccounts();
    const matched = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (matched) {
      const { password: _, ...sessionUser } = matched;
      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
      closeAuthModal();
      return { success: true };
    }

    // Auto-create collector profile for this verified email
    const username = cleanEmail.split('@')[0];
    const newUser: StoredAccount = {
      id: `user-email-${Date.now()}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: cleanEmail,
      phone: '+91 98000 00000',
      role: 'COLLECTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isPhoneVerified: false,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newUser]);
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    closeAuthModal();
    return { success: true };
  };

  // Social OAuth Login
  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'instagram'): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        const newUser: User = {
          id: `user-oauth-${Date.now()}`,
          name: provider === 'google' ? 'Google Collector' : provider === 'facebook' ? 'Meta Collector' : 'Instagram Art Collector',
          email: `${provider}.collector@artvault.in`,
          phone: '+91 98000 11111',
          role: 'COLLECTOR',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          isPhoneVerified: true,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
        closeAuthModal();
        resolve(true);
      }, 600);
    });
  };

  // Sign Out
  const logout = () => {
    setUser(null);
    setActiveArtistProfile(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  // Update User Profile
  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const modified: User = { ...user, ...updated };
    setUser(modified);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(modified));

    // Also update in accounts store
    const accounts = getStoredAccounts();
    const updatedAccounts = accounts.map(a => (a.id === user.id ? { ...a, ...updated } : a));
    saveStoredAccounts(updatedAccounts);
  };

  // Legacy setRole helper (maps to seeded account login for testing, but properly authenticated)
  const setRole = (newRole: UserRole) => {
    const seed = SEED_ACCOUNTS.find(a => a.role === newRole);
    if (!seed) return;
    const { password: _, ...sessionUser } = seed;
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalView,
        authTargetRole,
        activeArtistProfile,
        openAuthModal,
        closeAuthModal,
        signInWithPassword,
        signUp,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
        loginWithOAuth,
        logout,
        updateUser,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
