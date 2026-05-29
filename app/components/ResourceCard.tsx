import Link from 'next/link';
import { CATEGORY_LABELS, type Recommendation } from '@/lib/types';
import type { getStrings } from '@/lib/i18n';
import { ShareButton } from './ShareButton';
import { FeedbackButtons } from './FeedbackButtons';

export function ResourceCard({
  rec,
  vote,
  onVote,
  advisorMode = false,
  s,
}: {
  rec: Recommendation;
  vote: 'helpful' | 'not_helpful' | undefined;
  onVote: (helpful: boolean) => void;
  advisorMode?: boolean;
  s: ReturnType<typeof getStrings>;
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
            {CATEGORY_LABELS[rec.resource.category]} · {Math.round(rec.score * 100)}% {s.matchPct}
          </span>
          <Link
            href={`/resources/${rec.resource.id}`}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-uw-husky-purple transition-colors"
          >
            {s.aboutResourceLink}
          </Link>
          <ShareButton rec={rec} s={s} />
        </div>
      </div>

      {advisorMode && rec.scores && (
        <div className="mb-4 rounded-xl border border-uw-husky-purple/20 bg-uw-accent-lavender/10 p-3">
          <p className="text-xs font-bold text-uw-husky-purple mb-2 uppercase tracking-wider">{s.scoreBreakdown}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { label: 'Embedding', value: rec.scores.embedding },
                { label: 'Category', value: rec.scores.category },
                { label: 'Tags', value: rec.scores.tags },
                { label: 'Urgency', value: rec.scores.urgency },
              ] as const
            ).map(({ label, value }) => (
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
        <FeedbackButtons vote={vote} onVote={onVote} s={s} />
      </div>
    </li>
  );
}
