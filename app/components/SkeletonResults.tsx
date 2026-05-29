export function SkeletonResults() {
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

/** Shown after needs arrive but while recommendations are still loading. */
export function SkeletonRecommendations() {
  return (
    <div className="space-y-10 mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-pulse">
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
      <div className="animate-pulse">
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
    </div>
  );
}
