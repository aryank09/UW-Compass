'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  type Campus,
  type ExtractedNeed,
  type RecommendResponse,
} from '@/lib/types';
import { useSafeLocalStorage } from '@/lib/hooks';
import { getStrings, detectLocale, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import { SkeletonResults, SkeletonRecommendations } from './components/SkeletonResults';
import { Results, NeedsSection } from './components/Results';
import { CompareResults } from './components/CompareResults';

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
// Stream parsing helpers
// ---------------------------------------------------------------------------

type StreamEvent =
  | { type: 'needs'; needs: ExtractedNeed[] }
  | ({ type: 'done' } & RecommendResponse)
  | { type: 'error'; error: string };

async function parseRecommendStream(
  res: Response,
  onNeeds: (needs: ExtractedNeed[]) => void,
  onDone: (data: RecommendResponse) => void
): Promise<void> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop()!;
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line) as StreamEvent;
        if (event.type === 'error') throw new Error(event.error);
        else if (event.type === 'needs') onNeeds(event.needs);
        else if (event.type === 'done') {
          const { type: _, ...responseData } = event;
          onDone(responseData as RecommendResponse);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Resolves to the full result; used for compare mode where partial state is not needed. */
async function callRecommend(params: { input: string; campus: Campus }): Promise<RecommendResponse> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return new Promise<RecommendResponse>((resolve, reject) => {
    parseRecommendStream(res, () => {}, resolve).catch(reject);
  });
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
  const [partialNeeds, setPartialNeeds] = useState<ExtractedNeed[] | null>(null);

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
    const params = new URLSearchParams(window.location.search);
    if (params.get('advisor') === '1') setAdvisorMode(true);
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d: { queries?: string[] }) => setGalleryQueries(d.queries ?? []))
      .catch(() => {/* gallery is optional */});
  }, []);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (input.trim().length < 3) return;

    setError(null);
    setPartialNeeds(null);

    if (compareMode) {
      setCompareLoading(true);
      setCompareData(null);
      try {
        const [seattleRes, bothellRes, tacomaRes] = await Promise.all(
          (['seattle', 'bothell', 'tacoma'] as Campus[]).map((c) =>
            callRecommend({ input, campus: c })
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

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      await parseRecommendStream(
        res,
        (needs) => setPartialNeeds(needs),
        (result) => {
          setData(result);
          setPartialNeeds(null);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setPartialNeeds(null);
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
      {advisorMode && (
        <div className="mb-6 rounded-xl border border-uw-husky-purple/30 bg-uw-accent-lavender/20 px-5 py-3 flex items-center gap-3">
          <span className="text-sm font-bold text-uw-husky-purple">{s.advisorMode}</span>
          <span className="text-xs text-slate-600">
            Full scores and all resources are returned. Add{' '}
            <code className="bg-slate-100 px-1 rounded">?advisor=1</code> to the URL to stay in this mode.
          </span>
        </div>
      )}

      <header className="mb-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3 w-full">
            <h1 className="text-5xl font-extrabold tracking-tight text-uw-husky-purple">UW Compass</h1>
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
            An AI resource finder for UW students. Describe what's going on, and we'll point you to the right
            campus resources and a clear next step.
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

      {galleryQueries.length > 0 && !data && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            {s.recentQueries}
          </p>
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

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={compareMode}
                onClick={() => setCompareMode((v) => !v)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-uw-spirit-purple/30 ${
                  compareMode ? 'bg-uw-husky-purple border-uw-husky-purple' : 'bg-slate-200 border-slate-200'
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
        {/* Full skeleton while waiting for needs from the stream */}
        {(loading && !partialNeeds) && <SkeletonResults />}
        {compareLoading && <SkeletonResults />}

        {/* Progressive: show real needs + skeleton recommendations while summarizing */}
        {loading && partialNeeds && !data && (
          <section className="mt-12 space-y-10">
            <NeedsSection needs={partialNeeds} s={s} />
            <SkeletonRecommendations />
          </section>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {compareMode && compareData && (
          <CompareResults data={compareData} s={s} feedback={feedback} onFeedback={sendFeedback} />
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
        UW Compass is a CSS 382 student project. It surfaces official UW resources but is not a substitute for
        them. For emergencies, call 911 or contact{' '}
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
