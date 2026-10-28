import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center px-4 text-center bg-[var(--bg-primary)]">
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
        <Film className="w-10 h-10" />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-2">
        Page Not Found
      </h1>

      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/en"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Evoless Home</span>
      </Link>
    </div>
  );
}
