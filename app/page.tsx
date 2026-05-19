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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-husky-purple">UW Compass</h1>
            <span className="hidden text-sm text-slate-500 sm:inline">
              an AI resource finder for UW students
            </span>
          </div>
          <Link
            href="/about"
            className="text-sm text-slate-500 hover:text-husky-purple hover:underline"
          >
            About / How it works →
          </Link>
        </div>
        <p className="mt-2 text-slate-600">
          Describe what's going on. We'll point you to the right campus resources and a clear next
          step.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="input" className="block text-sm font-medium text-slate-700">
            What do you need help with?
          </label>
          <div
            role="radiogroup"
            aria-label="Campus filter"
            className="flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs"
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
                      ? 'rounded-full bg-husky-purple px-3 py-1 font-semibold text-white'
                      : 'rounded-full px-3 py-1 text-slate-600 hover:text-husky-purple disabled:opacity-50'
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
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-husky-purple focus:outline-none focus:ring-2 focus:ring-husky-purple/30"
          disabled={loading}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setInput(ex)}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-husky-purple hover:text-husky-purple disabled:opacity-50"
              >
                {ex.length > 48 ? ex.slice(0, 45) + '…' : ex}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || input.trim().length < 3}
            className="rounded-lg bg-husky-purple px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-husky-purple/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Finding resources…' : 'Find resources'}
          </button>
        </div>
      </form>

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
    <section className="mt-10 space-y-8">
      {urgent && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong className="block">Your situation sounds time-sensitive.</strong>
          If you're in crisis, call the{' '}
          <a href="https://wellbeing.uw.edu/husky-helpline/" className="underline">
            Husky HelpLine
          </a>{' '}
          (24/7) or{' '}
          <a href="https://www.washington.edu/safecampus/" className="underline">
            SafeCampus
          </a>
          .
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          What we heard
        </h2>
        {data.needs.length === 0 ? (
          <p className="text-sm text-slate-600">
            We weren't sure which category fits — the recommendations below are based on overall
            similarity to UW resources.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.needs.map((need, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
              >
                <span className="inline-flex items-center rounded-full bg-husky-purple/10 px-2 py-0.5 text-xs font-medium text-husky-purple">
                  {CATEGORY_LABELS[need.category]}
                </span>
                <span className="flex-1 text-sm text-slate-700">{need.evidence}</span>
                <span className="text-xs text-slate-400">intensity {need.intensity}/5</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recommended resources
        </h2>
        <ul className="space-y-4">
          {data.recommendations.map((rec) => (
            <li
              key={rec.resource.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  href={rec.resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold text-husky-purple hover:underline"
                >
                  {rec.resource.name}
                </a>
                <span className="text-xs text-slate-500">
                  {CATEGORY_LABELS[rec.resource.category]} · match{' '}
                  {Math.round(rec.score * 100)}%
                </span>
              </div>
              {rec.why && <p className="mt-2 text-sm text-slate-700">{rec.why}</p>}
              <p className="mt-2 text-sm text-slate-500">{rec.resource.description}</p>
              {rec.matched_tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rec.matched_tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your next steps this week
        </h2>
        <ol className="space-y-2">
          {data.next_steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700"
            >
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-husky-purple text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
