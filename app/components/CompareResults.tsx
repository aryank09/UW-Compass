import { CATEGORY_LABELS, type RecommendResponse } from '@/lib/types';
import type { getStrings } from '@/lib/i18n';
import { FeedbackButtons } from './FeedbackButtons';

export function CompareResults({
  data,
  s,
  feedback,
  onFeedback,
}: {
  data: {
    seattle: RecommendResponse | null;
    bothell: RecommendResponse | null;
    tacoma: RecommendResponse | null;
  };
  s: ReturnType<typeof getStrings>;
  feedback: Record<string, 'helpful' | 'not_helpful'>;
  onFeedback: (id: string, helpful: boolean) => void;
}) {
  const columns: { label: string; data: RecommendResponse | null }[] = [
    { label: 'Seattle', data: data.seattle },
    { label: 'Bothell', data: data.bothell },
    { label: 'Tacoma', data: data.tacoma },
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
                  <li key={rec.resource.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
