import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllResources, getResourceById } from '@/lib/db';
import { CATEGORY_LABELS } from '@/lib/types';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllResources().map((r) => ({ id: r.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const r = getResourceById(params.id);
  if (!r) return { title: 'Resource not found — UW Compass' };
  return {
    title: `${r.name} — UW Compass`,
    description: `${r.description} See which student situations route to ${r.name} at UW.`,
  };
}

/** Human-readable sentences derived from tags. Helps office staff understand routing. */
function tagToSentence(tag: string): string {
  return tag.replace(/_/g, ' ');
}

export default function ResourcePage({ params }: Props) {
  const resource = getResourceById(params.id);
  if (!resource) notFound();

  const allResources = getAllResources();

  // Related resources: share at least one tag, different ID.
  const related = allResources
    .filter((r) => r.id !== resource.id && r.tags.some((t) => resource.tags.includes(t)))
    .sort((a, b) => {
      // Sort by number of shared tags descending.
      const sharedA = a.tags.filter((t) => resource.tags.includes(t)).length;
      const sharedB = b.tags.filter((t) => resource.tags.includes(t)).length;
      return sharedB - sharedA;
    })
    .slice(0, 6);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: resource.name,
    description: resource.description,
    url: resource.url,
    serviceType: CATEGORY_LABELS[resource.category],
    provider: {
      '@type': 'EducationalOrganization',
      name: 'University of Washington',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-uw-husky-purple hover:underline transition-colors">
            UW Compass
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{resource.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center rounded-full bg-uw-accent-lavender/30 px-3 py-1 text-xs font-bold text-uw-husky-purple">
              {CATEGORY_LABELS[resource.category]}
            </span>
            {resource.urgent && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Crisis / Urgent support
              </span>
            )}
            {resource.campus !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 capitalize">
                {resource.campus} campus
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-uw-husky-purple mb-3">
            {resource.name}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">{resource.description}</p>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-uw-spirit-gold px-6 py-3 text-base font-bold text-uw-husky-purple shadow-sm hover:bg-[#e6b300] hover:shadow-md transition-all"
          >
            Visit official page
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Who routes here */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
            Students who end up here often say…
          </h2>
          <ul className="space-y-2">
            {resource.tags.map((tag) => (
              <li key={tag} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-uw-spirit-purple flex-none" />
                <span className="text-base text-slate-700 capitalize">{tagToSentence(tag)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tags */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
            Matched keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* Related resources */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
              Related resources
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => {
                const shared = r.tags.filter((t) => resource.tags.includes(t));
                return (
                  <li key={r.id}>
                    <Link
                      href={`/resources/${r.id}`}
                      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-uw-spirit-purple/30 hover:shadow-md transition-all"
                    >
                      <p className="font-semibold text-uw-husky-purple group-hover:text-uw-spirit-purple group-hover:underline transition-colors mb-1">
                        {r.name}
                      </p>
                      <p className="text-xs text-slate-500 mb-2">{CATEGORY_LABELS[r.category]}</p>
                      <div className="flex flex-wrap gap-1">
                        {shared.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {t.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Back / Try the tool */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-uw-spirit-purple/40 hover:text-uw-husky-purple transition-all"
          >
            ← Find resources for my situation
          </Link>
          <p className="text-xs text-slate-500">
            UW Compass surfaces official UW pages — it is not a substitute for them.
          </p>
        </div>
      </main>
    </>
  );
}
