import { CATEGORY_LABELS, type ExtractedNeed, type RecommendResponse } from '@/lib/types';
import { downloadIcal } from '@/lib/ical';
import type { getStrings } from '@/lib/i18n';
import { ResourceCard } from './ResourceCard';

export function NeedsSection({
  needs,
  s,
}: {
  needs: ExtractedNeed[];
  s: ReturnType<typeof getStrings>;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold">
        {s.whatWeHeard}
      </h2>
      {needs.length === 0 ? (
        <p className="text-base text-slate-600 italic">
          {s.noCategoryMatch}
        </p>
      ) : (
        <ul className="space-y-3">
          {needs.map((need, i) => (
            <li
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-uw-accent-lavender/30 px-3 py-1 text-xs font-bold text-uw-husky-purple shrink-0">
                {CATEGORY_LABELS[need.category]}
              </span>
              <div className="flex-1">
                <span className="block text-base text-slate-700 font-medium mb-1.5">"{need.evidence}"</span>
                {need.tags && need.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {need.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-200/70 border border-slate-200/80 text-slate-500 text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 shrink-0">
                <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                  {s.intensityLabel}: {need.intensity}/5
                </span>
                {need.confidence && (
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm capitalize">
                    {s.confLabel}: {need.confidence}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Results({
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
          <p className="mb-3">{s.urgentBody}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wellbeing.uw.edu/husky-helpline/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-amber-400 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200 transition-colors"
            >
              Husky HelpLine (24/7) ↗
            </a>
            <a
              href="https://www.washington.edu/safecampus/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-amber-400 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200 transition-colors"
            >
              SafeCampus ↗
            </a>
          </div>
        </div>
      )}

      <NeedsSection needs={data.needs} s={s} />

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
              s={s}
            />
          ))}
        </ul>
      </div>

      {showAllResources && data.advisorData && (
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-uw-heritage-gold px-2">
            {s.allScores} ({data.advisorData.allResults.length} total)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Resource', 'Category', 'Total', 'Embed', 'Cat', 'Tags', 'Urg'].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 ${
                        h === 'Resource' || h === 'Category' ? 'text-left' : 'text-right'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.advisorData.allResults.map((rec, i) => (
                  <tr key={rec.resource.id} className={i < 5 ? 'bg-uw-accent-lavender/10' : 'hover:bg-slate-50'}>
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
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-700">
                      {(rec.score * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                      {rec.scores ? (rec.scores.embedding * 100).toFixed(0) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                      {rec.scores ? (rec.scores.category * 100).toFixed(0) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                      {rec.scores ? (rec.scores.tags * 100).toFixed(0) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">
                      {rec.scores ? (rec.scores.urgency * 100).toFixed(0) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 px-2 text-xs text-slate-400">
            Weights — Embedding: {(data.advisorData.weights.embedding * 100).toFixed(0)}% · Category:{' '}
            {(data.advisorData.weights.categoryMatch * 100).toFixed(0)}% · Tags:{' '}
            {(data.advisorData.weights.tagOverlap * 100).toFixed(0)}% · Urgency:{' '}
            {(data.advisorData.weights.urgencyBoost * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </section>
  );
}
