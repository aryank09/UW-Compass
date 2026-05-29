import type { getStrings } from '@/lib/i18n';

export function FeedbackButtons({
  vote,
  onVote,
  s,
}: {
  vote: 'helpful' | 'not_helpful' | undefined;
  onVote: (helpful: boolean) => void;
  s: ReturnType<typeof getStrings>;
}) {
  if (vote) {
    return (
      <span className="text-xs text-slate-400 italic">
        {vote === 'helpful' ? s.feedbackThanks : s.feedbackNoted}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onVote(true)}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors"
        aria-label={s.helpful}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        {s.helpful}
      </button>
      <button
        onClick={() => onVote(false)}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label={s.notHelpful}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        {s.notHelpful}
      </button>
    </div>
  );
}
