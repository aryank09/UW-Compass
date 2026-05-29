'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router error boundary for the root route segment.
 * Rendered whenever a thrown error propagates out of app/page.tsx (or any
 * nested layout/page in this segment) instead of showing a white screen.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-uw-husky-purple">UW Compass</h1>
      </header>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="mb-2 text-xl font-bold text-red-800">Something went wrong</p>
        <p className="mb-6 text-sm text-red-700">
          An unexpected error occurred. Please try again, or reload the page.
          {error.digest && (
            <span className="ml-1 font-mono text-xs text-red-500">(ref: {error.digest})</span>
          )}
        </p>
        <button
          onClick={reset}
          className="rounded-xl bg-uw-spirit-gold px-6 py-2.5 text-sm font-bold text-uw-husky-purple shadow-sm transition-all hover:bg-[#e6b300] focus:ring-4 focus:ring-uw-spirit-gold/30"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
