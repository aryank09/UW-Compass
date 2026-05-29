'use client';

import { useState } from 'react';
import type { Recommendation } from '@/lib/types';
import type { getStrings } from '@/lib/i18n';

export function ShareButton({ rec, s }: { rec: Recommendation; s: ReturnType<typeof getStrings> }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `Check out this UW resource:\n${rec.resource.name} - ${rec.resource.url}\n\n${rec.resource.description}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* ignore */}
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-uw-husky-purple"
      aria-label={s.share}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {s.copied}
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {s.share}
        </>
      )}
    </button>
  );
}
