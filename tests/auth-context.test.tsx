import React, { type ReactNode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/lib/auth-context';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: false }),
        })
      )
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('rejects OTP verification without a complete phone number', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let response: Awaited<ReturnType<typeof result.current.verifyPhoneOtp>>;
    await act(async () => {
      response = await result.current.verifyPhoneOtp('', '123456');
    });

    expect(response!.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('rejects email OTP verification for an invalid address', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let response: Awaited<ReturnType<typeof result.current.verifyEmailOtp>>;
    await act(async () => {
      response = await result.current.verifyEmailOtp('', '654321');
    });

    expect(response!.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('rejects signup when the phone number is already registered', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let response: Awaited<ReturnType<typeof result.current.signUp>>;
    await act(async () => {
      response = await result.current.signUp({
        name: 'Another Kartik',
        email: 'another.kartik@example.com',
        password: 'password123',
        phone: '9000000003',
        role: 'COLLECTOR',
      });
    });

    expect(response!.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('removes legacy demo accounts while preserving user-created accounts', async () => {
    localStorage.setItem(
      'artvault_registered_accounts',
      JSON.stringify([
        { id: 'legacy', email: 'artist@artvault.in' },
        {
          id: 'custom',
          name: 'Custom User',
          email: 'custom@example.com',
          phone: '+91 98888 77777',
          role: 'COLLECTOR',
        },
      ])
    );
    localStorage.setItem(
      'artvault_active_session',
      JSON.stringify({ id: 'legacy', email: 'artist@artvault.in' })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(localStorage.getItem('artvault_registered_accounts')).not.toBeNull();
    });

    const accounts = JSON.parse(localStorage.getItem('artvault_registered_accounts')!);
    expect(accounts.map((account: { email: string }) => account.email)).toContain('custom@example.com');
    expect(accounts.map((account: { email: string }) => account.email)).not.toContain('artist@artvault.in');
    expect(result.current.user).toBeNull();
  });
});
