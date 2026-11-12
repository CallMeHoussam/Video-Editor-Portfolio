'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface StudioLoginProps {
  onSuccess?: () => void;
}

export function StudioLogin({ onSuccess }: StudioLoginProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your admin PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        setError(data.message || 'Incorrect PIN. Access denied.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-5 py-12">
      <div className="max-w-sm w-full">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] mb-4">
            <Lock className="w-4 h-4" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            Evoless Studio
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Portfolio & video hosting management
          </p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-pin"
                className="block text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2"
              >
                Admin PIN
              </label>
              <div className="relative">
                <input
                  id="admin-pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter admin PIN"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none text-[var(--text-primary)] text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/en" className="hover:text-[var(--text-primary)] transition-colors">
              Return to site
            </Link>
            <span>Authenticated session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
