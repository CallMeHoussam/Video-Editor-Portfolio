import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-[var(--bg-primary)]">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
        404
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/en"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] text-xs font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
