'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CATEGORY_LABELS,
  type Campus,
  type RecommendResponse,
  type Recommendation,
} from '@/lib/types';
import { downloadIcal } from '@/lib/ical';
import { getStrings, detectLocale, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';

const EXAMPLES = [
  'I am stressed, behind in math, and need somewhere quiet to study.',
  'I commute from Lynnwood and need help paying for the bus.',
  'I am running out of money for groceries and rent is due next week.',
  "I am a transfer student looking for an internship but my resume is rough.",
];

const CAMPUS_OPTIONS: { value: Campus; label: string }[] = [
  { value: 'all', label: 'All campuses' },
  { value: 'seattle', label: 'Seattle' },
  { value: 'bothell', label: 'Bothell' },
  { value: 'tacoma', label: 'Tacoma' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function useSafeLocalStorage<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {/* ignore */}
  }, [key]);

  const set = useCallback((v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {/* ignore */}
  }, [key]);

  return [value, set];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home() {
  const [input, setInput] = useSafeLocalStorage('uw-compass-input', '');
  const [campus, setCampus] = useSafeLocalStorage<Campus>('uw-compass-campus', 'all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useSafeLocalStorage<RecommendResponse | null>('uw-compass-data', null);
  const [error, setError] = useState<string | null>(null);

  // New feature state
  const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not_helpful'>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [compareData, setCompareData] = useState<{
    seattle: RecommendResponse | null;
    bothell: RecommendResponse | null;
    tacoma: RecommendResponse | null;
  } | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [shareQuery, setShareQuery] = useState(false);
  const [galleryQueries, setGalleryQueries] = useState<string[]>([]);
  const [locale, setLocale] = useState<Locale>('en');
  const [advisorMode, setAdvisorMode] = useState(false);

  const s = getStrings(locale);

  useEffect(() => {
    setLocale(detectLocale());
    // Detect advisor mode from URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('advisor') === '1') setAdvisorMode(true);
    // Load gallery queries
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d: { queries?: string[] }) => setGalleryQueries(d.queries ?? []))
      .catch(() => {/* gallery is optional */});
  }, []);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (input.trim().length < 3) return;

    setError(null);

    if (compareMode) {
      setCompareLoading(true);
      setCompareData(null);
      try {
        const [seattleRes, bothellRes, tacomaRes] = await Promise.all(
          (['seattle', 'bothell', 'tacoma'] as Campus[]).map((c) =>
            fetch('/api/recommend', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ input, campus: c }),
            }).then((r) => r.json() as Promise<RecommendResponse>)
          )
        );
        setCompareData({ seattle: seattleRes, bothell: bothellRes, tacoma: tacomaRes });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setCompareLoading(false);
      }
      return;
    }

    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, campus, advisor: advisorMode, shareQuery }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      setData(body as RecommendResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function sendFeedback(resourceId: string, helpful: boolean) {
    const vote: 'helpful' | 'not_helpful' = helpful ? 'helpful' : 'not_helpful';
    setFeedback((prev) => ({ ...prev, [resourceId]: vote }));
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, query: input, campus, helpful }),
    }).catch(() => {/* fire-and-forget */});
  }

  const isUrgent = data?.needs.some((n) => n.urgent) ?? false;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Advisor mode banner */}
      {advisorMode && (
        <div className="mb-6 rounded-xl border border-uw-husky-purple/30 bg-uw-accent-lavender/20 px-5 py-3 flex items-center gap-3">
          <span className="text-sm font-bold text-uw-husky-purple">
            {s.advisorMode}
          </span>
          <span className="text-xs text-slate-600">
            Full scores and all resources are returned. Add <code className="bg-slate-100 px-1 rounded">?advisor=1</code> to the URL to stay in this mode.
          </span>
        </div>
      )}

      <header className="mb-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3 w-full">
            <h1 className="text-5xl font-extrabold tracking-tight text-uw-husky-purple">
              UW Compass
            </h1>
            {/* Language selector */}
            <div className="ml-auto">
              <select
                aria-label="Language"
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm focus:border-uw-spirit-purple focus:outline-none focus:ring-2 focus:ring-uw-spirit-purple/20 transition-all"
              >
                {SUPPORTED_LOCALES.map((l) => (
                  <option key={l} value={l}>
                    {LOCALE_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-xl">
            An AI resource finder for UW students. Describe what's going on, and we'll point you to the right campus resources and a clear next step.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors"
          >
            {s.aboutLink}
          </Link>
        </div>
      </header>

      {/* Gallery chips */}
      {galleryQueries.length > 0 && !data && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{s.recentQueries}</p>
          <div className="flex flex-wrap gap-2">
            {galleryQueries.slice(0, 6).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInput(q)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-uw-spirit-purple hover:text-uw-spirit-purple transition-colors"
              >
                {q.length > 60 ? q.slice(0, 57) + '…' : q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-4">
            <label htmlFor="input" className="block text-base font-semibold text-slate-800">
              {s.whatDoYouNeed}
            </label>

            {/* Mobile campus select */}
            {!compareMode && (
              <div className="block min-[480px]:hidden w-full">
                <select
                  aria-label={s.campusLabel}
                  value={campus}
                  onChange={(e) => setCampus(e.target.value as Campus)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm shadow-sm focus:border-uw-spirit-purple focus:outline-none focus:ring-4 focus:ring-uw-spirit-purple/20 transition-all"
                >
                  {CAMPUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Desktop campus pills — hidden in compare mode */}
            {!compareMode && (
              <div
                role="radiogroup"
                aria-label={s.campusLabel}
                className="hidden min-[480px]:flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm"
              >
                {CAMPUS_OPTIONS.map((opt) => {
                  const active = campus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setCampus(opt.value)}
                      disabled={loading}
                      className={
                        active
                          ? 'rounded-full bg-uw-husky-purple px-4 py-1.5 font-semibold text-white shadow-sm transition-all'
                          : 'rounded-full px-4 py-1.5 text-slate-600 hover:text-uw-husky-purple hover:bg-slate-100 disabled:opacity-50 transition-all'
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Compare mode badge */}
            {compareMode && (
              <span className="hidden min-[480px]:inline-flex items-center gap-1.5 rounded-full bg-uw-accent-lavender/30 px-4 py-1.5 text-sm font-semibold text-uw-husky-purple">
                Seattle · Bothell · Tacoma
              </span>
            )}
          </div>

          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder={s.placeholder}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-4 text-base shadow-inner focus:bg-white focus:border-uw-spirit-purple focus:outline-none focus:ring-4 focus:ring-uw-spirit-purple/20 transition-all resize-none block"
            disabled={loading || compareLoading}
          />

          {/* Example chips + submit row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setInput(ex)}
                  disabled={loading || compareLoading}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-uw-spirit-purple hover:text-uw-spirit-purple disabled:opacity-50 transition-colors"
                >
                  {ex.length > 48 ? ex.slice(0, 45) + '…' : ex}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || compareLoading || input.trim().length < 3}
              className="w-full sm:w-auto rounded-xl bg-uw-spirit-gold px-8 py-3 text-base font-bold text-uw-husky-purple shadow-sm transition-all hover:bg-[#e6b300] hover:shadow-md focus:ring-4 focus:ring-uw-spirit-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || compareLoading ? s.loading : s.submit}
            </button>
          </div>

          {/* Feature toggles row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 border-t border-slate-100">
            {/* Compare campuses toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={compareMode}
                onClick={() => setCompareMode((v) => !v)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-uw-spirit-purple/30 ${
                  compareMode
                    ? 'bg-uw-husky-purple border-uw-husky-purple'
                    : 'bg-slate-200 border-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    compareMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-600">{s.compareCampuses}</span>
            </label>

            {/* Share query toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shareQuery}
                onChange={(e) => setShareQuery(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-uw-husky-purple focus:ring-uw-spirit-purple/30"
              />
              <span className="text-xs text-slate-500">{s.shareQueryLabel}</span>
            </label>
          </div>
        </form>
      </div>

      <div aria-live="polite">
        {(loading || compareLoading) && <SkeletonResults />}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {compareMode && compareData && (
          <CompareResults
            data={compareData}
            s={s}
            feedback={feedback}
            onFeedback={sendFeedback}
          />
        )}

        {!compareMode && data && (
          <Results
            data={data}
            s={s}
            isUrgent={isUrgent}
            feedback={feedback}
            onFeedback={sendFeedback}
            advisorMode={advisorMode}
          />
        )}
      </div>

      <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
        UW Compass is a CSS 382 student project. It surfaces official UW resources but is not a
        substitute for them. For emergencies, call 911 or contact{' '}
        <a
          href="https://www.washington.edu/safecampus/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          SafeCampus
        </a>
        .
      </footer>
    </main>
  );
}

// ---------------------------------------------------------------------------
// ShareButton
// ---------------------------------------------------------------------------

function ShareButton({ rec }: { rec: Recommendation }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `Check out this UW resource:\n${rec.resource.name} - ${rec.resource.url}\n\n${rec.resource.description}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-uw-husky-purple"
      aria-label="Copy resource to clipboard"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// FeedbackButtons
// ---------------------------------------------------------------------------

function FeedbackButtons({
  rec,
  vote,
  onVote,
}: {
  rec: Recommendation;
  vote: 'helpful' | 'not_helpful' | undefined;
  onVote: (helpful: boolean) => void;
}) {
  if (vote) {
    return (
      <span className="text-xs text-slate-400 italic">
        {vote === 'helpful' ? 'Thanks for the feedback!' : 'Noted — we\'ll improve.'}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onVote(true)}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors"
        aria-label="This was helpful"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        Helpful
      </button>
      <button
        onClick={() => onVote(false)}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Not what I needed"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        Not what I needed
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResourceCard
// ---------------------------------------------------------------------------

function ResourceCard({
  rec,
  vote,
  onVote,
  advisorMode = false,
}: {
  rec: Recommendation;
  vote: 'helpful' | 'not_helpful' | undefined;
  onVote: (helpful: boolean) => void;
  advisorMode?: boolean;
}) {
  return (
    <li className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-uw-spirit-purple/30">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
        <a
          href={rec.resource.url}
          target="_blank"
          rel="noreferrer"
          className="text-xl font-bold text-uw-husky-purple group-hover:text-uw-spirit-purple group-hover:underline transition-colors"
        >
          {rec.resource.name}
        </a>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-uw-accent-teal" />
            {CATEGORY_LABELS[rec.resource.category]} · {Math.round(rec.score * 100)}% match
          </span>
          <Link
            href={`/resources/${rec.resource.id}`}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-uw-husky-purple transition-colors"
          >
            About
          </Link>
          <ShareButton rec={rec} />
        </div>
      </div>

      {/* Advisor score breakdown */}
      {advisorMode && rec.scores && (
        <div className="mb-4 rounded-xl border border-uw-husky-purple/20 bg-uw-accent-lavender/10 p-3">
          <p className="text-xs font-bold text-uw-husky-purple mb-2 uppercase tracking-wider">Score breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Embedding', value: rec.scores.embedding },
              { label: 'Category', value: rec.scores.category },
              { label: 'Tags', value: rec.scores.tags },
              { label: 'Urgency', value: rec.scores.urgency },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-start">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
                <div className="flex items-center gap-1.5 w-full mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-uw-husky-purple"
                      style={{ width: `${Math.round(value * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{(value * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.why && (
        <div className="mb-4 rounded-xl bg-uw-husky-gold-web/30 p-4 border border-uw-husky-gold-web/50">
          <p className="text-sm font-medium text-uw-husky-purple">{rec.why}</p>
        </div>
      )}
      <p className="text-base text-slate-600 leading-relaxed">{rec.resource.description}</p>

      {rec.matched_tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {rec.matched_tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <FeedbackButtons rec={rec} vote={vote} onVote={onVote} />
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// SkeletonResults
// ---------------------------------------------------------------------------

function SkeletonResults() {
  return (
    <section className="mt-12 space-y-10 animate-pulse" aria-hidden="true">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="h-4 w-32 bg-slate-200 rounded mb-5" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="h-4 w-48 bg-slate-200 rounded mb-5" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex-none" />
              <div className="h-4 bg-slate-100 rounded w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-4 w-48 bg-slate-200 rounded mb-5 px-2" />
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-1/3 bg-slate-200 rounded" />
                <div className="h-6 w-24 bg-slate-100 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Results (single campus)
// ---------------------------------------------------------------------------

function Results({
  data,
  s,
  isUrgent,
  feedback,
  onFeedback,
  advisorMode,
}: {
  data: RecommendResponse;
  s: ReturnType<typeof getStrings>;
  isUrgent: boolean;
  feedback: Record<string, 'helpful' | 'not_helpful'>;
  onFeedback: (id: string, helpful: boolean) => void;
  advisorMode: boolean;
}) {
  const showAllResources = advisorMode && data.advisorData;

  return (
    <section className="mt-12 space-y-10">
      {isUrgent && (
        <div className="rounded-xl border-l-4 border-uw-spirit-gold bg-amber-50 p-5 text-amber-900 shadow-sm">
          <strong className="block text-lg mb-1">{s.urgentTitle}</strong>
          <p>
            If you're in crisis, call the{' '}
            <a href="https://wellbeing.uw.edu/husky-helpline/" className="font-bold underline hover:text-uw-husky-purple transition-colors">
              Husky HelpLine
            </a>{' '}
            (24/7) or{' '}
            <a href="https://www.washington.edu/safecampus/" className="font-bold underline hover:text-uw-husky-purple transition-colors">
              SafeCampus
            </a>
            .
          </p>
        </div>
      )}

      {/* What we heard */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
          {s.whatWeHeard}
        </h2>
        {data.needs.length === 0 ? (
          <p className="text-base text-slate-600 italic">
            We weren't sure which category fits — the recommendations below are based on overall similarity to UW resources.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.needs.map((need, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                <span className="inline-flex w-fit items-center rounded-full bg-uw-accent-lavender/30 px-3 py-1 text-xs font-bold text-uw-husky-purple shrink-0">
                  {CATEGORY_LABELS[need.category]}
                </span>
                <div className="flex-1">
                  <span className="block text-base text-slate-700 font-medium mb-1.5">"{need.evidence}"</span>
                  {need.tags && need.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {need.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-slate-200/70 border border-slate-200/80 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                          {t.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                    Intensity: {need.intensity}/5
                  </span>
                  {need.confidence && (
                    <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm capitalize">
                      Conf: {need.confidence}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Next steps + iCal download */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
            {s.nextSteps}
          </h2>
          <button
            type="button"
            onClick={() => downloadIcal(data.next_steps, isUrgent)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-uw-husky-purple hover:border-uw-spirit-purple/40 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {s.downloadCal}
          </button>
        </div>
        <ol className="space-y-4">
          {data.next_steps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-uw-spirit-purple text-sm font-bold text-white shadow-sm mt-0.5">
                {i + 1}
              </span>
              <span className="text-base text-slate-700 leading-relaxed pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Recommended resources */}
      <div>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold px-2">
          {s.recommended}
        </h2>
        <ul className="grid grid-cols-1 gap-6">
          {data.recommendations.map((rec) => (
            <ResourceCard
              key={rec.resource.id}
              rec={rec}
              vote={feedback[rec.resource.id]}
              onVote={(helpful) => onFeedback(rec.resource.id, helpful)}
              advisorMode={advisorMode}
            />
          ))}
        </ul>
      </div>

      {/* Advisor: full results table */}
      {showAllResources && data.advisorData && (
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold px-2">
            {s.allScores} ({data.advisorData.allResults.length} total)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Resource</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Embed</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Cat</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Tags</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Urg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.advisorData.allResults.map((rec, i) => (
                  <tr
                    key={rec.resource.id}
                    className={i < 5 ? 'bg-uw-accent-lavender/10' : 'hover:bg-slate-50'}
                  >
                    <td className="px-4 py-2.5">
                      <a
                        href={rec.resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-uw-husky-purple hover:underline"
                      >
                        {rec.resource.name}
                      </a>
                      {i < 5 && (
                        <span className="ml-2 text-[10px] font-bold text-uw-spirit-purple uppercase">top 5</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{CATEGORY_LABELS[rec.resource.category]}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-700">{(rec.score * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{rec.scores ? (rec.scores.embedding * 100).toFixed(0) : '—'}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{rec.scores ? (rec.scores.category * 100).toFixed(0) : '—'}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{rec.scores ? (rec.scores.tags * 100).toFixed(0) : '—'}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{rec.scores ? (rec.scores.urgency * 100).toFixed(0) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 px-2 text-xs text-slate-400">
            Weights — Embedding: {(data.advisorData.weights.embedding * 100).toFixed(0)}% · Category: {(data.advisorData.weights.categoryMatch * 100).toFixed(0)}% · Tags: {(data.advisorData.weights.tagOverlap * 100).toFixed(0)}% · Urgency: {(data.advisorData.weights.urgencyBoost * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// CompareResults (three-column campus view)
// ---------------------------------------------------------------------------

function CompareResults({
  data,
  s,
  feedback,
  onFeedback,
}: {
  data: { seattle: RecommendResponse | null; bothell: RecommendResponse | null; tacoma: RecommendResponse | null };
  s: ReturnType<typeof getStrings>;
  feedback: Record<string, 'helpful' | 'not_helpful'>;
  onFeedback: (id: string, helpful: boolean) => void;
}) {
  const columns: { campus: string; label: string; data: RecommendResponse | null }[] = [
    { campus: 'seattle', label: 'Seattle', data: data.seattle },
    { campus: 'bothell', label: 'Bothell', data: data.bothell },
    { campus: 'tacoma', label: 'Tacoma', data: data.tacoma },
  ];

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
        {s.compareCampuses}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ label, data: colData }) => (
          <div key={label}>
            <h3 className="mb-4 text-base font-bold text-uw-husky-purple border-b border-slate-200 pb-2">
              {label}
            </h3>
            {colData && 'error' in colData ? (
              <p className="text-sm text-slate-500 italic">{String((colData as { error: string }).error)}</p>
            ) : colData ? (
              <ul className="space-y-4">
                {colData.recommendations.slice(0, 3).map((rec) => (
                  <li
                    key={rec.resource.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <a
                      href={rec.resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-uw-husky-purple hover:underline block mb-1"
                    >
                      {rec.resource.name}
                    </a>
                    <p className="text-xs text-slate-500 mb-2">
                      {CATEGORY_LABELS[rec.resource.category]} · {Math.round(rec.score * 100)}% {s.matchPct}
                    </p>
                    {rec.why && (
                      <p className="text-xs text-slate-600 leading-relaxed">{rec.why}</p>
                    )}
                    <div className="mt-3">
                      <FeedbackButtons
                        rec={rec}
                        vote={feedback[rec.resource.id]}
                        onVote={(helpful) => onFeedback(rec.resource.id, helpful)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No results</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
