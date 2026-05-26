import Link from 'next/link';
import { CATEGORY_LABELS, CATEGORIES } from '@/lib/types';
import embedded from '@/data/resources.embedded.json';

export const metadata = {
  title: 'About UW Compass',
  description:
    'How UW Compass works: motivation, architecture, AI integration, and a guide to using the app.',
};

const RESOURCE_COUNT = (embedded as unknown[]).length;

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <nav className="mb-10 flex items-center justify-between text-sm font-medium">
        <Link href="/" className="flex items-center gap-2 text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors">
          <span>←</span> Back to UW Compass
        </Link>
        <a
          href="https://github.com/aryank09/UW-Compass"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-slate-500 hover:text-uw-husky-purple hover:underline transition-colors"
        >
          GitHub repository <span>↗</span>
        </a>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-uw-husky-purple">About UW Compass</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed">
          A CSS 382 (Intro to AI) project that helps UW students find the right campus resource by
          describing their situation in plain language.
        </p>
      </header>

      <Section title="Overview & motivation">
        <p className="mb-4 text-slate-700 leading-relaxed">
          UW has more support services than most students know about — tutoring, counseling, food
          security, transportation, study spaces, career help, financial aid. The problem isn't
          availability; it's <strong className="text-uw-husky-purple">fragmentation</strong>. Each office runs its own site, its own
          intake form, its own vocabulary. A student in trouble usually knows what's going wrong
          ("I'm overwhelmed and behind in math"), not which office to email.
        </p>
        <p className="text-slate-700 leading-relaxed">
          <strong className="text-uw-husky-purple">UW Compass</strong> closes that gap. You type your situation in your own words. The app extracts
          the underlying needs, matches them against a curated set of <span className="font-semibold text-uw-spirit-purple">{RESOURCE_COUNT} official UW
          resources</span>, and gives you ranked recommendations with a short action plan.
        </p>
      </Section>

      <Section title="UW community impact">
        <p className="mb-4 text-slate-700 leading-relaxed">
          The students hit hardest by resource fragmentation are usually the ones with the least
          time to navigate it: first-year students, transfer students, commuters, and students
          juggling academic, financial, and wellness pressure at once. UW Compass benefits them by:
        </p>
        <ul className="list-disc space-y-2 pl-6 mb-6 text-slate-700">
          <li>reducing the time students spend searching for help;</li>
          <li>making existing UW services easier to discover;</li>
          <li>letting students describe needs in plain language instead of office names;</li>
          <li>providing short summaries and direct next-step recommendations;</li>
          <li>supporting students who are overwhelmed and need a clearer path to action.</li>
        </ul>
        <div className="bg-uw-husky-gold-web/30 border-l-4 border-uw-heritage-gold p-4 rounded-r-xl">
          <p className="text-sm text-slate-800 leading-relaxed">
            UW Compass <em className="font-semibold">does not replace</em> official UW resources. Every recommendation links
            out to the corresponding UW office or page. It's a routing layer, not a service of its
            own. For emergencies, students are pointed at{' '}
            <a
              href="https://www.washington.edu/safecampus/"
              className="font-bold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              SafeCampus
            </a>{' '}
            and the{' '}
            <a
              href="https://wellbeing.uw.edu/counseling-center/husky-helpline/"
              className="font-bold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Husky HelpLine (24/7)
            </a>
            .
          </p>
        </div>
      </Section>

      <Section title="Architecture">
        <p className="mb-6 text-slate-700 leading-relaxed">
          One Next.js application. The frontend is a small client-side form; the backend is a
          single API route running on Node. There's no separate database server — the curated
          resource set and its precomputed embeddings live in the deploy bundle as a JSON file,
          regenerated by <code>npm run seed</code>.
        </p>
        
        {/* Modern Flowchart */}
        <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          <div className="min-w-[600px] flex flex-col items-center gap-4 text-sm">
            
            {/* Browser */}
            <div className="flex flex-col items-center">
              <div className="bg-white border-2 border-uw-husky-purple text-uw-husky-purple font-bold px-6 py-3 rounded-xl shadow-sm">
                Browser (Client)
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
                {/* Parallel Tasks */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-1">Parallel Processing</div>
                  <div className="bg-uw-accent-lavender/20 border border-uw-spirit-purple/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-spirit-purple mb-1">lib/ai.ts</div>
                    <div className="text-xs text-slate-600">OpenAI text-embedding-3-small</div>
                    <div className="text-[10px] text-slate-500 mt-1">(input embedding)</div>
                  </div>
                  <div className="bg-uw-accent-lavender/20 border border-uw-spirit-purple/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-spirit-purple mb-1">lib/ai.ts</div>
                    <div className="text-xs text-slate-600">OpenAI gpt-4o-mini + tool</div>
                    <div className="text-[10px] text-slate-500 mt-1">(need extraction)</div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center pt-12">
                  <div className="w-8 h-0.5 bg-slate-300"></div>
                  <div className="text-[10px] text-slate-400 mt-1">Wait</div>
                </div>

                {/* DB & Ranking */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-1">Ranking</div>
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center">
                    <div className="font-semibold text-slate-700 mb-1">lib/db.ts</div>
                    <div className="text-xs text-slate-600">data/resources.embedded.json</div>
                    <div className="text-[10px] text-slate-500 mt-1">(precomputed embeddings)</div>
                  </div>
                  <div className="bg-uw-accent-teal/10 border border-uw-accent-teal/50 rounded-lg p-3 text-center">
                    <div className="font-semibold text-uw-husky-purple mb-1">lib/recommend.ts</div>
                    <div className="text-xs text-slate-600">Cosine + Tags + Diversify</div>
                  </div>
                </div>
              </div>

              {/* Final Step */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="bg-uw-accent-pink/10 border border-uw-accent-pink/40 rounded-lg p-4 text-center max-w-md mx-auto">
                  <div className="font-semibold text-uw-husky-purple mb-1">lib/ai.ts</div>
                  <div className="text-xs text-slate-600">OpenAI gpt-4o-mini + tool</div>
                  <div className="text-[10px] text-slate-500 mt-1">(per-resource why + next steps)</div>
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
                Browser (UI Render)
              </div>
            </div>

          </div>
        </div>

        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <strong className="text-slate-800">Note:</strong> Three OpenAI calls per request: 1 embedding + 2 chat completions. The first two run in
          parallel. Resource embeddings are computed once at seed time, never per request.
        </p>
      </Section>

      <Section title="Tech stack">
        <ul className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Tech name="Frontend" detail="Next.js 16 (App Router), React 18, Tailwind CSS" />
          <Tech name="API" detail="Next.js Route Handlers (Node runtime)" />
          <Tech name="Embeddings" detail="OpenAI text-embedding-3-small (1536 dim)" />
          <Tech name="Need extraction" detail="OpenAI gpt-4o-mini + function calling (Zod-typed)" />
          <Tech name="Storage" detail="Static JSON bundled into the deploy" />
          <Tech name="Testing" detail="Vitest — 26 tests covering ranker + schema + scenarios" />
          <Tech name="Hosting" detail="Vercel (frontend + serverless API)" />
          <Tech name="Quality" detail="Link-health checker run before each milestone" />
        </ul>
      </Section>

      <Section title="How the AI works">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">1</span>
              Need extraction
            </h3>
            <p className="text-slate-700 leading-relaxed">
              The student's free-text input is sent to GPT-4o-mini with a typed tool definition. The
              model is required to return structured needs — each one with a <code className="bg-slate-100 px-1.5 py-0.5 rounded text-uw-spirit-purple">category</code>,{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-uw-spirit-purple">intensity</code> (1–5), the supporting evidence from the input, fine-grained{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-uw-spirit-purple">tags</code> (snake_case), and an <code className="bg-slate-100 px-1.5 py-0.5 rounded text-uw-spirit-purple">urgent</code> boolean for safety-critical
              situations. No free-form JSON, no parsing fragility.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">2</span>
              Semantic retrieval
            </h3>
            <p className="text-slate-700 leading-relaxed">
              The same input is also embedded into a 1536-dimensional vector. Every resource has a
              precomputed embedding (name + category + description + tags). We compute cosine
              similarity between the input and every resource — fast because we only have{' '}
              <span className="font-semibold text-uw-spirit-purple">{RESOURCE_COUNT} resources</span>, no vector database needed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">3</span>
              Multi-signal ranking
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              The final score combines four signals:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">0.50 × Semantic match</strong>
                <span className="text-slate-600">Normalized cosine similarity</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">0.25 × Category match</strong>
                <span className="text-slate-600">Does the category match an extracted need?</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">0.15 × Tag overlap</strong>
                <span className="text-slate-600">Share of extracted tags present in resource</span>
              </li>
              <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-uw-spirit-purple block mb-1">0.10 × Urgency boost</strong>
                <span className="text-slate-600">Student is urgent AND resource is urgent</span>
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              After scoring, the top 5 are picked with category diversification (max 2 from any one
              category) so a student with multiple needs doesn't get a homogeneous result list.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-uw-husky-purple flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uw-accent-lavender text-uw-husky-purple text-sm">4</span>
              Per-resource explanations + next steps
            </h3>
            <p className="text-slate-700 leading-relaxed">
              The top 5 resources plus the extracted needs go back to GPT-4o-mini (again with a typed
              tool) which produces a 1–2 sentence explanation per resource and a 2–4 step ordered
              action plan referencing the student's words.
            </p>
          </div>
        </div>
      </Section>

      <Section title="User guide">
        <ol className="list-decimal space-y-3 pl-6 text-slate-700 marker:text-uw-spirit-purple marker:font-bold">
          <li className="pl-2">
            Go to the <Link href="/" className="font-semibold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors">home page</Link>.
          </li>
          <li className="pl-2">
            Describe what's going on in your own words. Be honest about what's hard — "I'm
            stressed and behind in math" works better than "I need tutoring."
          </li>
          <li className="pl-2">
            Click <strong className="text-uw-husky-purple">Find resources</strong>. The first request takes ~3–5 seconds (three
            OpenAI calls).
          </li>
          <li className="pl-2">
            Read the <em className="font-medium">What we heard</em> section first — that's the AI's interpretation. If it's
            off, rephrase and try again.
          </li>
          <li className="pl-2">
            Click any recommendation to go to the official UW page. The <em className="font-medium">Your next steps</em>{' '}
            list is the recommended order to act on them.
          </li>
        </ol>
        <div className="mt-6 rounded-xl border-l-4 border-uw-spirit-gold bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
          <strong className="block text-base mb-1">This isn't a crisis service.</strong> 
          <p>For emergencies call 911. For mental-health
          support call the Husky HelpLine (24/7). For safety concerns contact SafeCampus.</p>
        </div>
      </Section>

      <Section title="Categories we cover">
        <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li
              key={c}
              className="flex items-center justify-center text-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-uw-spirit-purple shadow-sm hover:border-uw-spirit-purple/30 transition-colors"
            >
              {CATEGORY_LABELS[c]}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Built by">
        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          CSS 382 — Introduction to AI · Spring 2026 · A two-person DYOP team. Source code on{' '}
          <a
            href="https://github.com/aryank09/UW-Compass"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-uw-husky-purple hover:text-uw-spirit-purple underline transition-colors"
          >
            GitHub
          </a>
          .
        </p>
      </Section>

      <footer className="mt-16 border-t border-slate-200 pt-8 pb-12 text-sm font-medium text-slate-500 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-uw-spirit-purple hover:text-uw-husky-purple hover:underline transition-colors">
          <span>←</span> Back to the app
        </Link>
        <span>© 2026 UW Compass</span>
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

function Tech({ name, detail }: { name: string; detail: string }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <span className="block text-xs font-bold uppercase tracking-widest text-uw-heritage-gold mb-1.5">
        {name}
      </span>
      <span className="text-sm font-medium text-slate-700">{detail}</span>
    </li>
  );
}
