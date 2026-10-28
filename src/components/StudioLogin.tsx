'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

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
        body: JSON.stringify({ pin: pin.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          // Hard refresh to reload server session
          window.location.reload();
        }
      } else {
        setError(data.message || 'Incorrect PIN. Access denied.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-purple-900/40 border border-purple-400/30">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-display text-3xl font-black text-[var(--text-primary)] tracking-tight">
            EVOLESS STUDIO
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">
            Admin access & portfolio video management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="admin-pin" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Master Admin PIN / Password
              </label>
              <div className="relative">
                <input
                  id="admin-pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-[var(--text-primary)] text-sm transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pin.trim()}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
            <Link
              href="/"
              className="text-xs text-[var(--text-muted)] hover:text-purple-400 transition-colors"
            >
              ← Return to public portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
