'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORY_LABELS, type Campus, type RecommendResponse } from '@/lib/types';

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

export default function Home() {
  const [input, setInput] = useState('');
  const [campus, setCampus] = useState<Campus>('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (input.trim().length < 3) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, campus }),
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

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl font-extrabold tracking-tight text-uw-husky-purple">
            UW Compass
          </h1>
          <p className="text-lg text-slate-600 max-w-xl">
            An AI resource finder for UW students. Describe what's going on, and we'll point you to the right campus resources and a clear next step.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/about"
            className="text-sm font-medium text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors"
          >
            About / How it works →
          </Link>
        </div>
      </header>

      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label htmlFor="input" className="block text-base font-semibold text-slate-800">
              What do you need help with?
            </label>
            <div
              role="radiogroup"
              aria-label="Campus filter"
              className="flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm"
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
          </div>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="e.g. I'm overwhelmed, behind in math, and need a quiet place to study."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-4 text-base shadow-inner focus:bg-white focus:border-uw-spirit-purple focus:outline-none focus:ring-4 focus:ring-uw-spirit-purple/20 transition-all resize-none block"
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setInput(ex)}
                  disabled={loading}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-uw-spirit-purple hover:text-uw-spirit-purple disabled:opacity-50 transition-colors"
                >
                  {ex.length > 48 ? ex.slice(0, 45) + '…' : ex}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || input.trim().length < 3}
              className="w-full sm:w-auto rounded-xl bg-uw-spirit-gold px-8 py-3 text-base font-bold text-uw-husky-purple shadow-sm transition-all hover:bg-[#e6b300] hover:shadow-md focus:ring-4 focus:ring-uw-spirit-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Finding resources…' : 'Find resources'}
            </button>
          </div>
        </form>
        {loading && (
          <div className="absolute bottom-[1px] left-[1px] right-[1px] h-1.5 overflow-hidden rounded-b-[15px] bg-slate-200">
            <div className="h-full w-1/2 bg-uw-husky-purple animate-indeterminate"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {data && <Results data={data} />}

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

function Results({ data }: { data: RecommendResponse }) {
  const urgent = data.needs.some((n) => n.urgent);
  return (
    <section className="mt-12 space-y-10">
      {urgent && (
        <div className="rounded-xl border-l-4 border-uw-spirit-gold bg-amber-50 p-5 text-amber-900 shadow-sm">
          <strong className="block text-lg mb-1">Your situation sounds time-sensitive.</strong>
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
          What we heard
        </h2>
        {data.needs.length === 0 ? (
          <p className="text-base text-slate-600 italic">
            We weren't sure which category fits — the recommendations below are based on overall
            similarity to UW resources.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.needs.map((need, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-uw-accent-lavender/30 px-3 py-1 text-xs font-bold text-uw-spirit-purple">
                  {CATEGORY_LABELS[need.category]}
                </span>
                <span className="flex-1 text-base text-slate-700 font-medium">"{need.evidence}"</span>
                <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                  Intensity: {need.intensity}/5
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
          Your next steps this week
        </h2>
        <ol className="space-y-4">
          {data.next_steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-4 items-start"
            >
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-uw-spirit-purple text-sm font-bold text-white shadow-sm mt-0.5">
                {i + 1}
              </span>
              <span className="text-base text-slate-700 leading-relaxed pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold px-2">
          Recommended resources
        </h2>
        <ul className="grid grid-cols-1 gap-6">
          {data.recommendations.map((rec) => (
            <li
              key={rec.resource.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-uw-spirit-purple/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <a
                  href={rec.resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold text-uw-husky-purple group-hover:text-uw-spirit-purple group-hover:underline transition-colors"
                >
                  {rec.resource.name}
                </a>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-uw-accent-teal"></span>
                  {CATEGORY_LABELS[rec.resource.category]} · {Math.round(rec.score * 100)}% match
                </span>
              </div>
              {rec.why && (
                <div className="mb-4 rounded-xl bg-uw-husky-gold-web/30 p-4 border border-uw-husky-gold-web/50">
                  <p className="text-sm font-medium text-uw-husky-purple">{rec.why}</p>
                </div>
              )}
              <p className="text-base text-slate-600 leading-relaxed">{rec.resource.description}</p>
              {rec.matched_tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {rec.matched_tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
