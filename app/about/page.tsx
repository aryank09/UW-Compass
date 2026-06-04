import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';
import { getStrings, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import embedded from '@/data/resources.embedded.json';

export const metadata = {
  title: 'About UW Compass',
  description:
    'How UW Compass works: motivation, architecture, AI integration, and a guide to using the app.',
};

const RESOURCE_COUNT = (embedded as unknown[]).length;

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await searchParams;
  const locale: Locale = SUPPORTED_LOCALES.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : 'en';
  const s = getStrings(locale);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <nav className="mb-10 flex items-center justify-between text-sm font-medium">
        <Link
          href={`/?locale=${locale}`}
          className="flex items-center gap-2 text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors"
        >
          {s.aboutNavBack}
        </Link>
        <a
          href="https://github.com/aryank09/UW-Compass"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-slate-500 hover:text-uw-husky-purple hover:underline transition-colors"
        >
          {s.aboutNavGitHub}
        </a>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-uw-husky-purple">{s.aboutPageTitle}</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed">
          {s.aboutPageSubtitle}
        </p>
      </header>

      <Section title={s.aboutSec1}>
        <p className="mb-4 text-slate-700 leading-relaxed">{s.aboutOverviewP1}</p>
        <p className="text-slate-700 leading-relaxed">
          {s.aboutOverviewP2.replace('{count}', String(RESOURCE_COUNT))}
        </p>
      </Section>

      <Section title={s.aboutSec2}>
        <p className="mb-4 text-slate-700 leading-relaxed">{s.aboutImpactIntro}</p>
        <ul className="list-disc space-y-2 pl-6 mb-6 text-slate-700">
          <li>{s.aboutImpact1}</li>
          <li>{s.aboutImpact2}</li>
          <li>{s.aboutImpact3}</li>
          <li>{s.aboutImpact4}</li>
          <li>{s.aboutImpact5}</li>
        </ul>
        <div className="bg-uw-husky-gold-web/30 border-l-4 border-uw-heritage-gold p-4 rounded-r-xl">
          <p className="text-sm text-slate-800 leading-relaxed">
            {s.aboutDisclaimerText.split('SafeCampus')[0]}
            <a
              href="https://www.washington.edu/safecampus/"
              className="font-bold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              SafeCampus
            </a>
            {s.aboutDisclaimerText.includes('Husky HelpLine') && (
              <>
                {s.aboutDisclaimerText.split('SafeCampus')[1]?.split('Husky HelpLine')[0]}
                <a
                  href="https://wellbeing.uw.edu/counseling-center/husky-helpline/"
                  className="font-bold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Husky HelpLine (24/7)
                </a>
                {s.aboutDisclaimerText.split('Husky HelpLine')[2] ?? '.'}
              </>
            )}
          </p>
        </div>
      </Section>

      <Section title={s.aboutSec3}>
        <p className="mb-6 text-slate-700 leading-relaxed">{s.aboutArchIntro}</p>

        {/* Modern Flowchart */}
        <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          <div className="min-w-[640px] flex flex-col items-center gap-4 text-sm">
            {/* Browser */}
            <div className="flex flex-col items-center">
              <div className="bg-white border-2 border-uw-husky-purple text-uw-husky-purple font-bold px-6 py-3 rounded-xl shadow-sm">
                {s.aboutFlowClient}
              </div>
              <div className="h-6 w-0.5 bg-slate-300"></div>
              <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-2">
                POST /api/recommend {`{ input }`}
              </div>
              <div className="h-6 w-0.5 bg-slate-300"></div>
            </div>

            {/* API Route */}
            <div className="w-full max-w-2xl bg-white border-2 border-uw-spirit-gold rounded-2xl p-6 shadow-sm relative">
              <div className="absolute -top-3 left-6 bg-uw-spirit-gold text-uw-husky-purple text-xs font-bold px-3 py-1 rounded-full">
                app/api/recommend/route.ts
              </div>
              <div className="flex justify-between items-start gap-4 mt-2">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-1">{s.aboutFlowParallel}</div>
                  <div className="bg-uw-accent-lavender/20 border border-uw-spirit-purple/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-spirit-purple mb-1">lib/ai.ts</div>
                    <div className="text-xs text-slate-600">OpenAI text-embedding-3-small</div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.aboutFlowCapEmbedding}</div>
                  </div>
                  <div className="bg-uw-accent-lavender/20 border border-uw-spirit-purple/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-spirit-purple mb-1">lib/ai.ts</div>
                    <div className="text-xs text-slate-600">OpenAI gpt-4o-mini + tool</div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.aboutFlowCapNeed}</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center pt-12">
                  <div className="w-8 h-0.5 bg-slate-300"></div>
                  <div className="text-[10px] text-slate-400 mt-1">{s.aboutFlowWait}</div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-1">{s.aboutFlowRanking}</div>
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center">
                    <div className="font-semibold text-slate-700 mb-1">lib/db.ts</div>
                    <div className="text-xs text-slate-600">data/resources.embedded.json</div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.aboutFlowCapPrecomputed}</div>
                  </div>
                  <div className="bg-uw-accent-teal/10 border border-uw-accent-teal/50 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-husky-purple mb-1">lib/recommend.ts</div>
                    <div className="text-xs text-slate-600">Cosine + Tags + Diversify</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="bg-uw-accent-pink/10 border border-uw-accent-pink/40 rounded-lg p-4 text-center max-w-md mx-auto">
                  <div className="font-semibold text-uw-husky-purple mb-1">lib/ai.ts</div>
                  <div className="text-xs text-slate-600">OpenAI gpt-4o-mini + tool</div>
                  <div className="text-[10px] text-slate-500 mt-1">{s.aboutFlowCapExplain}</div>
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-slate-300"></div>
              <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-2">
                {`{ needs, recommendations[5], next_steps[2-4] }`}
              </div>
              <div className="h-6 w-0.5 bg-slate-300"></div>
              <div className="bg-white border-2 border-uw-husky-purple text-uw-husky-purple font-bold px-6 py-3 rounded-xl shadow-sm">
                {s.aboutFlowRender}
              </div>
            </div>

            {/* Supabase side flows */}
            <div className="w-full max-w-2xl mt-2 border-t border-slate-200 pt-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-4">Supabase (Postgres) — gallery &amp; feedback</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[180px]">
                  <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    GET /api/gallery
                  </div>
                  <div className="h-5 w-0.5 bg-slate-300"></div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-center w-full">
                    <div className="font-semibold text-emerald-700 text-xs mb-0.5">gallery_queries</div>
                    <div className="text-[10px] text-slate-500">10 most recent shared queries → chips shown on page load</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[180px]">
                  <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    POST /api/feedback
                  </div>
                  <div className="h-5 w-0.5 bg-slate-300"></div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-center w-full">
                    <div className="font-semibold text-emerald-700 text-xs mb-0.5">feedback</div>
                    <div className="text-[10px] text-slate-500">one row per helpful / not-helpful vote</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <strong className="text-slate-800">{s.aboutArchNoteLabel}</strong> {s.aboutArchNoteBody}
        </p>
      </Section>

      <Section title={s.aboutSec4}>
        <ul className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Tech name={s.aboutTechFrontend} detail="Next.js 16 (App Router), React 18, Tailwind CSS" />
          <Tech name={s.aboutTechApi} detail="Next.js Route Handlers (Node runtime)" />
          <Tech name={s.aboutTechEmbeddings} detail="OpenAI text-embedding-3-small (1536 dim)" />
          <Tech name={s.aboutTechNeedExtraction} detail="OpenAI gpt-4o-mini + function calling (Zod-typed)" />
          <Tech name={s.aboutTechStorage} detail={s.aboutTechStorageDetail} wide />
          <Tech name={s.aboutTechTesting} detail={s.aboutTechTestingDetail} />
          <Tech name={s.aboutTechHosting} detail={s.aboutTechHostingDetail} />
          <Tech name={s.aboutTechQuality} detail={s.aboutTechQualityDetail} />
        </ul>
      </Section>

      <Section title={s.aboutSec5}>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">1</span>
              {s.aboutAiStep1}
            </h3>
            <p className="text-slate-700 leading-relaxed">{s.aboutAiStep1Body}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">2</span>
              {s.aboutAiStep2}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {s.aboutAiStep2Body.replace('{count}', String(RESOURCE_COUNT))}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">3</span>
              {s.aboutAiStep3}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">{s.aboutAiStep3Intro}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">{s.aboutScore1Label}</strong>
                <span className="text-slate-600">{s.aboutScore1Desc}</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">{s.aboutScore2Label}</strong>
                <span className="text-slate-600">{s.aboutScore2Desc}</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">{s.aboutScore3Label}</strong>
                <span className="text-slate-600">{s.aboutScore3Desc}</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">{s.aboutScore4Label}</strong>
                <span className="text-slate-600">{s.aboutScore4Desc}</span>
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">{s.aboutAiStep3Outro}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">4</span>
              {s.aboutAiStep4}
            </h3>
            <p className="text-slate-700 leading-relaxed">{s.aboutAiStep4Body}</p>
          </div>
        </div>
      </Section>

      <Section title={s.aboutSec6}>
        <ol className="list-decimal space-y-3 pl-6 text-slate-700 marker:text-uw-spirit-purple marker:font-bold">
          <li className="pl-2">{s.aboutGuide1}</li>
          <li className="pl-2">{s.aboutGuide2}</li>
          <li className="pl-2">{s.aboutGuide3}</li>
          <li className="pl-2">{s.aboutGuide4}</li>
          <li className="pl-2">{s.aboutGuide5}</li>
        </ol>
        <div className="mt-6 rounded-xl border-l-4 border-uw-spirit-gold bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
          <strong className="block text-base mb-1">{s.aboutCrisisTitle}</strong>
          <p>{s.aboutCrisisBody}</p>
        </div>
      </Section>

      <Section title={s.aboutSec7}>
        <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li
              key={c}
              className="flex items-center justify-center text-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-uw-spirit-purple shadow-sm hover:border-uw-spirit-purple/30 transition-colors"
            >
              {s.categoryLabels[c]}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={s.aboutSec8}>
        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {s.aboutBuiltBy}
          <a
            href="https://github.com/aryank09/UW-Compass"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
          >
            GitHub
          </a>
          {s.aboutBuiltBySuffix}
        </p>
      </Section>

      <footer className="mt-16 border-t border-slate-200 pt-8 pb-12 text-sm font-medium text-slate-500 flex justify-between items-center">
        <Link
          href={`/?locale=${locale}`}
          className="flex items-center gap-2 text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors"
        >
          {s.aboutFooterBack}
        </Link>
        <span>{s.aboutFooterCopyright}</span>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 flex items-center gap-3">
        <span className="w-8 h-1 bg-uw-spirit-gold rounded-full"></span>
        {title}
      </h2>
      <div className="text-slate-700">{children}</div>
    </section>
  );
}

function Tech({ name, detail, wide }: { name: string; detail: string; wide?: boolean }) {
  return (
    <li className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow${wide ? ' sm:col-span-2' : ''}`}>
      <span className="block text-xs font-bold uppercase tracking-widest text-uw-heritage-gold mb-1.5">
        {name}
      </span>
      <span className="text-sm font-medium text-slate-700">{detail}</span>
    </li>
  );
}
