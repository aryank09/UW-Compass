import type { Category } from './types';

export const SUPPORTED_LOCALES = ['en', 'es', 'zh', 'vi', 'ko'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  vi: 'Tiếng Việt',
  ko: '한국어',
};

export interface UIStrings {
  // Search form
  placeholder: string;
  submit: string;
  loading: string;
  findResources: string;
  whatDoYouNeed: string;
  campusLabel: string;
  campusAll: string;
  shareQueryLabel: string;
  compareCampuses: string;
  singleSearch: string;
  // Example queries
  ex1: string;
  ex2: string;
  ex3: string;
  ex4: string;
  // Hero
  heroTagline: string;
  aboutLink: string;
  recentQueries: string;
  // Results
  nextSteps: string;
  downloadCal: string;
  whatWeHeard: string;
  recommended: string;
  urgentTitle: string;
  urgentBody: string;
  noCategoryMatch: string;
  intensityLabel: string;
  confLabel: string;
  noResults: string;
  matchPct: string;
  // Feedback & share
  helpful: string;
  notHelpful: string;
  feedbackThanks: string;
  feedbackNoted: string;
  share: string;
  copied: string;
  // Resource card
  aboutResourceLink: string;
  scoreBreakdown: string;
  // Advisor mode
  advisorMode: string;
  advisorBannerDetail: string;
  allScores: string;
  // Footer
  footerDisclaimer: string;
  // About page navigation & header
  aboutNavBack: string;
  aboutNavGitHub: string;
  aboutPageTitle: string;
  aboutPageSubtitle: string;
  aboutFooterBack: string;
  aboutFooterCopyright: string;
  // About page sections
  aboutSec1: string;
  aboutSec2: string;
  aboutSec3: string;
  aboutSec4: string;
  aboutSec5: string;
  aboutSec6: string;
  aboutSec7: string;
  aboutSec8: string;
  // About — AI steps
  aboutAiStep1: string;
  aboutAiStep2: string;
  aboutAiStep3: string;
  aboutAiStep4: string;
  aboutAiStep5: string;
  // About — impact list
  aboutImpact1: string;
  aboutImpact2: string;
  aboutImpact3: string;
  aboutImpact4: string;
  aboutImpact5: string;
  // About — disclaimer
  aboutDisclaimerText: string;
  // About — user guide steps
  aboutGuide1: string;
  aboutGuide2: string;
  aboutGuide3: string;
  aboutGuide4: string;
  aboutGuide5: string;
  // About — crisis warning
  aboutCrisisTitle: string;
  aboutCrisisBody: string;
  // About — overview & motivation body
  aboutOverviewP1: string;
  aboutOverviewP2: string; // contains {count}
  // About — impact intro
  aboutImpactIntro: string;
  // About — architecture
  aboutArchIntro: string;
  aboutArchNoteLabel: string;
  aboutArchNoteBody: string;
  // About — flowchart labels
  aboutFlowClient: string;
  aboutFlowParallel: string;
  aboutFlowWait: string;
  aboutFlowRanking: string;
  aboutFlowRender: string;
  aboutFlowCapEmbedding: string;
  aboutFlowCapNeed: string;
  aboutFlowCapPrecomputed: string;
  aboutFlowCapExplain: string;
  // About — tech stack
  aboutTechFrontend: string;
  aboutTechApi: string;
  aboutTechEmbeddings: string;
  aboutTechNeedExtraction: string;
  aboutTechStorage: string;
  aboutTechStorageDetail: string;
  aboutTechTesting: string;
  aboutTechTestingDetail: string;
  aboutTechHosting: string;
  aboutTechHostingDetail: string;
  aboutTechQuality: string;
  aboutTechQualityDetail: string;
  // About — AI step bodies
  aboutAiStep1Body: string;
  aboutAiStep2Body: string; // contains {count}
  aboutAiStep3Intro: string;
  aboutScore1Label: string;
  aboutScore1Desc: string;
  aboutScore2Label: string;
  aboutScore2Desc: string;
  aboutScore3Label: string;
  aboutScore3Desc: string;
  aboutScore4Label: string;
  aboutScore4Desc: string;
  aboutAiStep3Outro: string;
  aboutAiStep4Body: string;
  aboutAiStep5Body: string;
  // About — built by
  aboutBuiltBy: string;
  aboutBuiltBySuffix: string;
  // Localized category labels
  categoryLabels: Record<Category, string>;
}

const strings: Record<Locale, UIStrings> = {
  en: {
    placeholder: "e.g. I'm overwhelmed, behind in math, and need a quiet place to study.",
    submit: 'Find resources',
    loading: 'Finding resources…',
    findResources: 'Find resources',
    whatDoYouNeed: 'What do you need help with?',
    campusLabel: 'Campus',
    campusAll: 'All campuses',
    shareQueryLabel: 'Share this query anonymously (helps other students)',
    compareCampuses: 'Compare campuses',
    singleSearch: 'Single campus',
    ex1: 'I am stressed, behind in math, and need somewhere quiet to study.',
    ex2: 'I commute from Lynnwood and need help paying for the bus.',
    ex3: 'I am running out of money for groceries and rent is due next week.',
    ex4: 'I am a transfer student looking for an internship but my resume is rough.',
    heroTagline:
      "An AI resource finder for UW students. Describe what's going on, and we'll point you to the right campus resources and a clear next step.",
    aboutLink: 'About / How it works →',
    recentQueries: 'Recent student questions',
    nextSteps: 'Your next steps this week',
    downloadCal: 'Add to calendar (.ics)',
    whatWeHeard: 'What we heard',
    recommended: 'Recommended resources',
    urgentTitle: 'Your situation sounds time-sensitive.',
    urgentBody:
      "If you're in crisis, call the Husky HelpLine (24/7) or SafeCampus.",
    noCategoryMatch:
      "We weren't sure which category fits — the recommendations below are based on overall similarity to UW resources.",
    intensityLabel: 'Intensity',
    confLabel: 'Conf',
    noResults: 'No results',
    matchPct: 'match',
    helpful: 'Helpful',
    notHelpful: 'Not what I needed',
    feedbackThanks: 'Thanks for the feedback!',
    feedbackNoted: "Noted — we'll improve.",
    share: 'Share',
    copied: 'Copied!',
    aboutResourceLink: 'About',
    scoreBreakdown: 'Score breakdown',
    advisorMode: 'Advisor mode',
    advisorBannerDetail:
      'Full scores and all resources are returned. Add ?advisor=1 to the URL to stay in this mode.',
    allScores: 'All resources & scores',
    footerDisclaimer:
      'UW Compass is a CSS 382 student project. It surfaces official UW resources but is not a substitute for them. For emergencies, call 911 or contact SafeCampus.',
    aboutNavBack: '← Back to UW Compass',
    aboutNavGitHub: 'GitHub repository ↗',
    aboutPageTitle: 'About UW Compass',
    aboutPageSubtitle:
      'A CSS 382 (Intro to AI) project that helps UW students find the right campus resource by describing their situation in plain language.',
    aboutFooterBack: '← Back to the app',
    aboutFooterCopyright: '© 2026 UW Compass',
    aboutSec1: 'Overview & motivation',
    aboutSec2: 'UW community impact',
    aboutSec3: 'Architecture',
    aboutSec4: 'Tech stack',
    aboutSec5: 'How the AI works',
    aboutSec6: 'User guide',
    aboutSec7: 'Categories we cover',
    aboutSec8: 'Built by',
    aboutAiStep1: 'Need extraction',
    aboutAiStep2: 'Semantic retrieval',
    aboutAiStep3: 'Multi-signal ranking',
    aboutAiStep4: 'Per-resource explanations + next steps',
    aboutImpact1: 'reducing the time students spend searching for help;',
    aboutImpact2: 'making existing UW services easier to discover;',
    aboutImpact3: 'letting students describe needs in plain language instead of office names;',
    aboutImpact4: 'providing short summaries and direct next-step recommendations;',
    aboutImpact5: 'supporting students who are overwhelmed and need a clearer path to action.',
    aboutDisclaimerText:
      'UW Compass does not replace official UW resources. Every recommendation links out to the corresponding UW office or page. It\'s a routing layer, not a service of its own. For emergencies, students are pointed at SafeCampus and the Husky HelpLine (24/7).',
    aboutGuide1: 'Go to the home page.',
    aboutGuide2:
      "Describe what's going on in your own words. Be honest about what's hard — \"I'm stressed and behind in math\" works better than \"I need tutoring.\"",
    aboutGuide3:
      'Click Find resources. The first request takes ~3–5 seconds (three OpenAI calls).',
    aboutGuide4:
      "Read the What we heard section first — that's the AI's interpretation. If it's off, rephrase and try again.",
    aboutGuide5:
      "Click any recommendation to go to the official UW page. The Your next steps list is the recommended order to act on them.",
    aboutCrisisTitle: "This isn't a crisis service.",
    aboutCrisisBody:
      'For emergencies call 911. For mental-health support call the Husky HelpLine (24/7). For safety concerns contact SafeCampus.',
    aboutOverviewP1:
      "UW has more support services than most students know about — tutoring, counseling, food security, transportation, study spaces, career help, financial aid. The problem isn't availability; it's fragmentation. Each office runs its own site, its own intake form, its own vocabulary. A student in trouble usually knows what's going wrong (\"I'm overwhelmed and behind in math\"), not which office to email.",
    aboutOverviewP2:
      'UW Compass closes that gap. You type your situation in your own words. The app extracts the underlying needs, matches them against a curated set of {count} official UW resources, and gives you ranked recommendations with a short action plan.',
    aboutImpactIntro:
      'The students hit hardest by resource fragmentation are usually the ones with the least time to navigate it: first-year students, transfer students, commuters, and students juggling academic, financial, and wellness pressure at once. UW Compass benefits them by:',
    aboutArchIntro:
      "One Next.js application. The frontend is a client-side React form; the backend is a set of API routes running on Node. The curated resource set and its precomputed embeddings live in the deploy bundle as a JSON file. Anonymously shared queries and feedback votes are stored in Supabase (Postgres) and accessed via the gallery and feedback API routes.",
    aboutArchNoteLabel: 'Note:',
    aboutArchNoteBody:
      'Three OpenAI calls per request: 1 embedding + 2 chat completions. The first two run in parallel. Optional two_pass and use_ai_ranker flags add 1–2 extra calls. Resource embeddings are computed once at seed time, never per request. Supabase writes (gallery, feedback) are fire-and-forget and do not block the response. A GitHub Actions CI workflow runs typecheck, lint, tests, and a full build on every push and PR.',
    aboutFlowClient: 'Browser (Client)',
    aboutFlowParallel: 'Parallel Processing',
    aboutFlowWait: 'Wait',
    aboutFlowRanking: 'Ranking',
    aboutFlowRender: 'Browser (UI Render)',
    aboutFlowCapEmbedding: '(input embedding)',
    aboutFlowCapNeed: '(need extraction)',
    aboutFlowCapPrecomputed: '(precomputed embeddings)',
    aboutFlowCapExplain: '(per-resource why + next steps)',
    aboutTechFrontend: 'Frontend',
    aboutTechApi: 'API',
    aboutTechEmbeddings: 'Embeddings',
    aboutTechNeedExtraction: 'Need extraction',
    aboutTechStorage: 'Storage',
    aboutTechStorageDetail: 'Resources: static JSON in deploy bundle · Gallery & feedback: Supabase (Postgres)',
    aboutTechTesting: 'Testing',
    aboutTechTestingDetail: 'Vitest — 83 tests across 7 files (ranker, schema, scenarios, i18n, iCal, rate limiter, campus filter)',
    aboutTechHosting: 'Hosting',
    aboutTechHostingDetail: 'Vercel (frontend + serverless API)',
    aboutTechQuality: 'Quality',
    aboutTechQualityDetail: 'GitHub Actions CI on every push & PR; weekly automated link-health check',
    aboutAiStep1Body:
      "The student's free-text input is sent to GPT-4o-mini with a typed tool definition. The model must return structured needs — each one with a category, an intensity (1–5), the supporting evidence from the input, fine-grained tags (snake_case), and an urgent boolean for safety-critical situations. No free-form JSON, no parsing fragility.",
    aboutAiStep2Body:
      'The same input is also embedded into a 1536-dimensional vector. Every resource has a precomputed embedding (name + category + description + tags). We compute cosine similarity between the input and every resource — fast because we only have {count} resources, no vector database needed.',
    aboutAiStep3Intro: 'The final score combines four signals:',
    aboutScore1Label: '0.50 × Semantic match',
    aboutScore1Desc: 'Normalized cosine similarity',
    aboutScore2Label: '0.25 × Category match',
    aboutScore2Desc: 'Does the category match an extracted need?',
    aboutScore3Label: '0.15 × Tag overlap',
    aboutScore3Desc: 'Share of extracted tags present in resource',
    aboutScore4Label: '0.10 × Urgency boost',
    aboutScore4Desc: 'Student is urgent AND resource is urgent',
    aboutAiStep3Outro:
      "After scoring, the top 5 are picked with category diversification (max 2 from any one category) so a student with multiple needs doesn't get a homogeneous result list.",
    aboutAiStep4Body:
      "The top 5 resources plus the extracted needs go back to GPT-4o-mini (again with a typed tool) which produces a 1–2 sentence explanation per resource and a 2–4 step ordered action plan referencing the student's words.",
    aboutAiStep5: 'Advanced options: two-pass critique, AI re-rank & iCal export',
    aboutAiStep5Body:
      'Three optional flags extend the core pipeline. two_pass sends a second GPT-4o-mini call right after need extraction — the model reviews its own output to catch false-urgent flags and missed categories. use_ai_ranker replaces the cosine ranker with an LLM pass that reads the full need list and selects the best-fitting resources directly (useful for comparing against the classical ranker). Once results arrive, the generated action plan can be downloaded as a standards-compliant .ics calendar file, scheduling each step automatically in any calendar app.',
    aboutBuiltBy:
      'CSS 382 — Introduction to AI · Spring 2026 · A two-person DYOP team. Source code on ',
    aboutBuiltBySuffix: '.',
    categoryLabels: {
      academic: 'Tutoring & Academic Support',
      wellness: 'Wellness & Counseling',
      basic_needs: 'Food & Basic Needs',
      transportation: 'Transportation & Commuter',
      study_space: 'Study Spaces',
      career: 'Career & Campus Jobs',
      financial: 'Financial Support',
    },
  },
  es: {
    placeholder:
      'ej. Estoy agobiado, atrasado en matemáticas y necesito un lugar tranquilo para estudiar.',
    submit: 'Buscar recursos',
    loading: 'Buscando recursos…',
    findResources: 'Buscar recursos',
    whatDoYouNeed: '¿Con qué necesitas ayuda?',
    campusLabel: 'Campus',
    campusAll: 'Todos los campus',
    shareQueryLabel: 'Compartir esta consulta de forma anónima (ayuda a otros estudiantes)',
    compareCampuses: 'Comparar campus',
    singleSearch: 'Campus único',
    ex1: 'Estoy estresado, atrasado en matemáticas y necesito un lugar tranquilo para estudiar.',
    ex2: 'Viajo desde Lynnwood y necesito ayuda para pagar el autobús.',
    ex3: 'Me estoy quedando sin dinero para comestibles y el alquiler vence la próxima semana.',
    ex4: 'Soy estudiante de transferencia buscando prácticas, pero mi currículum está sin pulir.',
    heroTagline:
      'Un buscador de recursos con IA para estudiantes de UW. Describe lo que está pasando y te indicaremos los recursos universitarios adecuados y un próximo paso claro.',
    aboutLink: 'Acerca / Cómo funciona →',
    recentQueries: 'Preguntas recientes de estudiantes',
    nextSteps: 'Tus próximos pasos esta semana',
    downloadCal: 'Agregar al calendario (.ics)',
    whatWeHeard: 'Lo que escuchamos',
    recommended: 'Recursos recomendados',
    urgentTitle: 'Tu situación parece urgente.',
    urgentBody: 'Si estás en crisis, llama a Husky HelpLine (24/7) o SafeCampus.',
    noCategoryMatch:
      'No estábamos seguros de qué categoría corresponde — las recomendaciones se basan en la similitud general con los recursos de UW.',
    intensityLabel: 'Intensidad',
    confLabel: 'Conf.',
    noResults: 'Sin resultados',
    matchPct: 'coincidencia',
    helpful: 'Útil',
    notHelpful: 'No era lo que necesitaba',
    feedbackThanks: '¡Gracias por tu opinión!',
    feedbackNoted: 'Anotado — mejoraremos.',
    share: 'Compartir',
    copied: '¡Copiado!',
    aboutResourceLink: 'Acerca de',
    scoreBreakdown: 'Desglose de puntaje',
    advisorMode: 'Modo asesor',
    advisorBannerDetail:
      'Se devuelven todos los puntajes y recursos. Agrega ?advisor=1 a la URL para permanecer en este modo.',
    allScores: 'Todos los recursos y puntajes',
    footerDisclaimer:
      'UW Compass es un proyecto de estudiantes de CSS 382. Muestra recursos oficiales de UW, pero no los reemplaza. Para emergencias, llama al 911 o contacta SafeCampus.',
    aboutNavBack: '← Volver a UW Compass',
    aboutNavGitHub: 'Repositorio en GitHub ↗',
    aboutPageTitle: 'Acerca de UW Compass',
    aboutPageSubtitle:
      'Un proyecto de CSS 382 (Introducción a la IA) que ayuda a los estudiantes de UW a encontrar el recurso universitario adecuado describiendo su situación en lenguaje sencillo.',
    aboutFooterBack: '← Volver a la aplicación',
    aboutFooterCopyright: '© 2026 UW Compass',
    aboutSec1: 'Descripción general y motivación',
    aboutSec2: 'Impacto en la comunidad de UW',
    aboutSec3: 'Arquitectura',
    aboutSec4: 'Tecnologías utilizadas',
    aboutSec5: 'Cómo funciona la IA',
    aboutSec6: 'Guía de usuario',
    aboutSec7: 'Categorías que cubrimos',
    aboutSec8: 'Creado por',
    aboutAiStep1: 'Extracción de necesidades',
    aboutAiStep2: 'Recuperación semántica',
    aboutAiStep3: 'Clasificación multi-señal',
    aboutAiStep4: 'Explicaciones por recurso + próximos pasos',
    aboutImpact1: 'reducir el tiempo que los estudiantes pasan buscando ayuda;',
    aboutImpact2: 'facilitar el descubrimiento de los servicios existentes de UW;',
    aboutImpact3:
      'permitir que los estudiantes describan sus necesidades en lenguaje sencillo en lugar de nombres de oficinas;',
    aboutImpact4: 'proporcionar resúmenes breves y recomendaciones directas de próximos pasos;',
    aboutImpact5:
      'apoyar a los estudiantes que están abrumados y necesitan un camino más claro hacia la acción.',
    aboutDisclaimerText:
      'UW Compass no reemplaza los recursos oficiales de UW. Cada recomendación enlaza a la oficina o página de UW correspondiente. Es una capa de orientación, no un servicio propio. Para emergencias, los estudiantes son dirigidos a SafeCampus y a Husky HelpLine (24/7).',
    aboutGuide1: 'Ve a la página de inicio.',
    aboutGuide2:
      'Describe lo que está pasando con tus propias palabras. Sé honesto sobre lo que es difícil — "Estoy estresado y atrasado en matemáticas" funciona mejor que "Necesito tutoría."',
    aboutGuide3:
      'Haz clic en Buscar recursos. La primera solicitud tarda ~3–5 segundos (tres llamadas a OpenAI).',
    aboutGuide4:
      'Lee primero la sección Lo que escuchamos — esa es la interpretación de la IA. Si está equivocada, reformula e intenta de nuevo.',
    aboutGuide5:
      'Haz clic en cualquier recomendación para ir a la página oficial de UW. La lista Tus próximos pasos es el orden recomendado para actuar.',
    aboutCrisisTitle: 'Este no es un servicio de crisis.',
    aboutCrisisBody:
      'Para emergencias llama al 911. Para apoyo de salud mental llama a Husky HelpLine (24/7). Para problemas de seguridad contacta SafeCampus.',
    aboutOverviewP1:
      'UW tiene más servicios de apoyo de los que la mayoría de los estudiantes conoce — tutoría, consejería, seguridad alimentaria, transporte, espacios de estudio, ayuda profesional, ayuda financiera. El problema no es la disponibilidad; es la fragmentación. Cada oficina tiene su propio sitio, su propio formulario de admisión, su propio vocabulario. Un estudiante con problemas suele saber qué le pasa ("Estoy abrumado y atrasado en matemáticas"), pero no a qué oficina escribir.',
    aboutOverviewP2:
      'UW Compass cierra esa brecha. Describes tu situación con tus propias palabras. La aplicación extrae las necesidades subyacentes, las compara con un conjunto curado de {count} recursos oficiales de UW y te da recomendaciones clasificadas con un breve plan de acción.',
    aboutImpactIntro:
      'Los estudiantes más afectados por la fragmentación de recursos suelen ser los que tienen menos tiempo para navegarla: estudiantes de primer año, estudiantes de transferencia, quienes viajan a diario y estudiantes que enfrentan presión académica, financiera y de bienestar a la vez. UW Compass los beneficia al:',
    aboutArchIntro:
      'Una sola aplicación Next.js. El frontend es un pequeño formulario del lado del cliente; el backend es una única ruta de API que se ejecuta en Node. No hay un servidor de base de datos aparte — el conjunto curado de recursos y sus embeddings precalculados viven en el paquete de despliegue como un archivo JSON, regenerado con npm run seed.',
    aboutArchNoteLabel: 'Nota:',
    aboutArchNoteBody:
      'Tres llamadas a OpenAI por solicitud: 1 embedding + 2 chat completions. Las dos primeras se ejecutan en paralelo. Los embeddings de los recursos se calculan una sola vez durante el seed, nunca por solicitud.',
    aboutFlowClient: 'Navegador (Cliente)',
    aboutFlowParallel: 'Procesamiento en paralelo',
    aboutFlowWait: 'Esperar',
    aboutFlowRanking: 'Clasificación',
    aboutFlowRender: 'Navegador (Renderizado de UI)',
    aboutFlowCapEmbedding: '(embedding de entrada)',
    aboutFlowCapNeed: '(extracción de necesidades)',
    aboutFlowCapPrecomputed: '(embeddings precalculados)',
    aboutFlowCapExplain: '(por qué de cada recurso + próximos pasos)',
    aboutTechFrontend: 'Frontend',
    aboutTechApi: 'API',
    aboutTechEmbeddings: 'Embeddings',
    aboutTechNeedExtraction: 'Extracción de necesidades',
    aboutTechStorage: 'Almacenamiento',
    aboutTechStorageDetail: 'Recursos: JSON estático en el paquete · Galería y feedback: Supabase (Postgres)',
    aboutTechTesting: 'Pruebas',
    aboutTechTestingDetail: 'Vitest — 83 pruebas en 7 archivos (clasificador, esquema, escenarios, i18n, iCal, limitador, campus)',
    aboutTechHosting: 'Hosting',
    aboutTechHostingDetail: 'Vercel (frontend + API serverless)',
    aboutTechQuality: 'Calidad',
    aboutTechQualityDetail: 'GitHub Actions CI en cada push y PR; verificación de enlaces semanal automatizada',
    aboutAiStep1Body:
      'La entrada de texto libre del estudiante se envía a GPT-4o-mini con una definición de herramienta tipada. El modelo debe devolver necesidades estructuradas — cada una con una category, una intensity (1–5), la evidencia de apoyo de la entrada, tags detalladas (snake_case) y un booleano urgent para situaciones críticas de seguridad. Sin JSON de forma libre, sin fragilidad de análisis.',
    aboutAiStep2Body:
      'La misma entrada también se convierte en un vector de 1536 dimensiones. Cada recurso tiene un embedding precalculado (nombre + categoría + descripción + etiquetas). Calculamos la similitud del coseno entre la entrada y cada recurso — rápido porque solo tenemos {count} recursos, sin necesidad de una base de datos vectorial.',
    aboutAiStep3Intro: 'La puntuación final combina cuatro señales:',
    aboutScore1Label: '0.50 × Coincidencia semántica',
    aboutScore1Desc: 'Similitud del coseno normalizada',
    aboutScore2Label: '0.25 × Coincidencia de categoría',
    aboutScore2Desc: '¿La categoría coincide con una necesidad extraída?',
    aboutScore3Label: '0.15 × Superposición de etiquetas',
    aboutScore3Desc: 'Proporción de etiquetas extraídas presentes en el recurso',
    aboutScore4Label: '0.10 × Aumento por urgencia',
    aboutScore4Desc: 'El estudiante es urgente Y el recurso es urgente',
    aboutAiStep3Outro:
      'Después de la puntuación, se eligen los 5 mejores con diversificación de categorías (máximo 2 de una misma categoría) para que un estudiante con varias necesidades no obtenga una lista de resultados homogénea.',
    aboutAiStep4Body:
      'Los 5 recursos principales más las necesidades extraídas vuelven a GPT-4o-mini (de nuevo con una herramienta tipada) que produce una explicación de 1–2 oraciones por recurso y un plan de acción ordenado de 2–4 pasos que hace referencia a las palabras del estudiante.',
    aboutAiStep5: 'Opciones avanzadas: dos pasadas, reclasificación IA y exportación a calendario',
    aboutAiStep5Body:
      'Tres indicadores opcionales amplían la canalización principal. two_pass añade una segunda llamada a GPT-4o-mini tras la extracción de necesidades — el modelo revisa su propio resultado para detectar alertas de urgencia falsas y categorías omitidas. use_ai_ranker reemplaza el clasificador coseno por un paso LLM que lee la lista completa de necesidades y selecciona directamente los recursos más adecuados. Una vez que llegan los resultados, el plan de acción puede descargarse como un archivo .ics compatible con estándares, programando cada paso automáticamente en cualquier aplicación de calendario.',
    aboutBuiltBy:
      'CSS 382 — Introducción a la IA · Primavera 2026 · Un equipo DYOP de dos personas. Código fuente en ',
    aboutBuiltBySuffix: '.',
    categoryLabels: {
      academic: 'Tutoría y apoyo académico',
      wellness: 'Bienestar y consejería',
      basic_needs: 'Alimentación y necesidades básicas',
      transportation: 'Transporte y transeúntes',
      study_space: 'Espacios de estudio',
      career: 'Carrera y empleos en el campus',
      financial: 'Apoyo financiero',
    },
  },
  zh: {
    placeholder: '例如：我不知所措，数学落后，需要一个安静的学习场所。',
    submit: '查找资源',
    loading: '正在查找资源…',
    findResources: '查找资源',
    whatDoYouNeed: '您需要什么帮助？',
    campusLabel: '校区',
    campusAll: '所有校区',
    shareQueryLabel: '匿名分享此查询（帮助其他学生）',
    compareCampuses: '比较校区',
    singleSearch: '单一校区',
    ex1: '我压力很大，数学落后，需要一个安静的学习地方。',
    ex2: '我从Lynnwood通勤，需要帮助支付公交费用。',
    ex3: '我的食品费用快用完了，下周还要交房租。',
    ex4: '我是转学生，正在寻找实习机会，但我的简历还不够好。',
    heroTagline:
      '面向UW学生的AI资源查找工具。描述您的情况，我们将为您指引合适的校园资源和下一步行动。',
    aboutLink: '关于 / 工作原理 →',
    recentQueries: '近期学生提问',
    nextSteps: '本周行动计划',
    downloadCal: '添加到日历 (.ics)',
    whatWeHeard: '我们的理解',
    recommended: '推荐资源',
    urgentTitle: '您的情况似乎很紧急。',
    urgentBody: '如遇危机，请拨打 Husky HelpLine（24/7）或联系 SafeCampus。',
    noCategoryMatch:
      '我们无法确定匹配的类别——以下建议基于与UW资源的整体相似度。',
    intensityLabel: '强度',
    confLabel: '置信度',
    noResults: '无结果',
    matchPct: '匹配',
    helpful: '有帮助',
    notHelpful: '不是我需要的',
    feedbackThanks: '感谢您的反馈！',
    feedbackNoted: '已记录——我们会改进。',
    share: '分享',
    copied: '已复制！',
    aboutResourceLink: '关于',
    scoreBreakdown: '评分详情',
    advisorMode: '顾问模式',
    advisorBannerDetail: '返回所有评分和资源。在URL中添加?advisor=1以保持此模式。',
    allScores: '所有资源和评分',
    footerDisclaimer:
      'UW Compass是CSS 382的学生项目。它展示官方UW资源，但不能替代这些资源。紧急情况请拨打911或联系SafeCampus。',
    aboutNavBack: '← 返回 UW Compass',
    aboutNavGitHub: 'GitHub 仓库 ↗',
    aboutPageTitle: '关于 UW Compass',
    aboutPageSubtitle:
      '这是CSS 382（AI入门）课程项目，帮助UW学生通过用自然语言描述情况来找到合适的校园资源。',
    aboutFooterBack: '← 返回应用',
    aboutFooterCopyright: '© 2026 UW Compass',
    aboutSec1: '概述与动机',
    aboutSec2: '对UW社区的影响',
    aboutSec3: '技术架构',
    aboutSec4: '技术栈',
    aboutSec5: 'AI工作原理',
    aboutSec6: '使用指南',
    aboutSec7: '涵盖的类别',
    aboutSec8: '开发者',
    aboutAiStep1: '需求提取',
    aboutAiStep2: '语义检索',
    aboutAiStep3: '多信号排名',
    aboutAiStep4: '每个资源的解释+后续步骤',
    aboutImpact1: '减少学生寻求帮助所花费的时间；',
    aboutImpact2: '使现有UW服务更易于发现；',
    aboutImpact3: '让学生用日常语言描述需求，而不是用办公室名称；',
    aboutImpact4: '提供简短摘要和直接的下一步建议；',
    aboutImpact5: '支持那些感到不知所措、需要更清晰行动路径的学生。',
    aboutDisclaimerText:
      'UW Compass不替代官方UW资源。每条建议都链接到相应的UW办公室或页面。它是一个导航层，不是独立服务。紧急情况下，学生将被引导至SafeCampus和Husky HelpLine（24/7）。',
    aboutGuide1: '前往主页。',
    aboutGuide2:
      '用您自己的话描述情况。诚实面对困难——"我很有压力，数学落后了"比"我需要辅导"更有效。',
    aboutGuide3: '点击查找资源。第一次请求约需3–5秒（三次OpenAI调用）。',
    aboutGuide4:
      '首先阅读我们的理解部分——那是AI的解读。如果有误，请重新表述再试。',
    aboutGuide5:
      '点击任意推荐以访问官方UW页面。本周行动计划列表是建议的操作顺序。',
    aboutCrisisTitle: '这不是危机服务。',
    aboutCrisisBody:
      '紧急情况请拨打911。心理健康支持请拨打Husky HelpLine（24/7）。安全问题请联系SafeCampus。',
    aboutOverviewP1:
      'UW 拥有的支持服务比大多数学生所知道的要多——辅导、咨询、食品保障、交通、学习空间、就业帮助、经济援助。问题不在于服务是否存在，而在于分散。每个办公室都有自己的网站、自己的申请表、自己的术语。遇到困难的学生通常知道自己出了什么问题（"我不堪重负，数学落后了"），却不知道该给哪个办公室发邮件。',
    aboutOverviewP2:
      'UW Compass 弥合了这一差距。你用自己的话描述情况，应用会提取潜在需求，将其与精选的 {count} 个官方 UW 资源进行匹配，并为你提供带有简短行动计划的排序建议。',
    aboutImpactIntro:
      '受资源分散影响最大的学生，往往是最没有时间去应对它的人：一年级新生、转学生、通勤学生，以及同时承受学业、经济和身心压力的学生。UW Compass 通过以下方式为他们提供帮助：',
    aboutArchIntro:
      '单个 Next.js 应用。前端是一个小型客户端表单；后端是运行在 Node 上的单个 API 路由。没有独立的数据库服务器——精选的资源集及其预计算的嵌入向量作为 JSON 文件存放在部署包中，通过 npm run seed 重新生成。',
    aboutArchNoteLabel: '注意：',
    aboutArchNoteBody:
      '每个请求调用三次 OpenAI：1 次嵌入 + 2 次聊天补全。前两次并行运行。资源嵌入在 seed 时计算一次，绝不在每次请求时计算。',
    aboutFlowClient: '浏览器（客户端）',
    aboutFlowParallel: '并行处理',
    aboutFlowWait: '等待',
    aboutFlowRanking: '排名',
    aboutFlowRender: '浏览器（界面渲染）',
    aboutFlowCapEmbedding: '（输入嵌入）',
    aboutFlowCapNeed: '（需求提取）',
    aboutFlowCapPrecomputed: '（预计算嵌入）',
    aboutFlowCapExplain: '（每个资源的理由 + 后续步骤）',
    aboutTechFrontend: '前端',
    aboutTechApi: 'API',
    aboutTechEmbeddings: '嵌入向量',
    aboutTechNeedExtraction: '需求提取',
    aboutTechStorage: '存储',
    aboutTechStorageDetail: '资源：部署包中的静态 JSON · 画廊与反馈：Supabase (Postgres)',
    aboutTechTesting: '测试',
    aboutTechTestingDetail: 'Vitest——83 个测试覆盖 7 个文件（排序器、模式、场景、i18n、iCal、限流器、校区过滤）',
    aboutTechHosting: '托管',
    aboutTechHostingDetail: 'Vercel（前端 + 无服务器 API）',
    aboutTechQuality: '质量',
    aboutTechQualityDetail: 'GitHub Actions CI 在每次推送和 PR 时运行；每周自动链接健康检查',
    aboutAiStep1Body:
      '学生的自由文本输入会连同一个类型化的工具定义发送给 GPT-4o-mini。模型必须返回结构化的需求——每项都包含 category（类别）、intensity（强度 1–5）、来自输入的支持证据、细粒度的 tags（snake_case 标签），以及用于安全关键情况的 urgent 布尔值。没有自由格式的 JSON，没有解析的脆弱性。',
    aboutAiStep2Body:
      '同样的输入也会被嵌入为 1536 维向量。每个资源都有预计算的嵌入（名称 + 类别 + 描述 + 标签）。我们计算输入与每个资源之间的余弦相似度——很快，因为我们只有 {count} 个资源，无需向量数据库。',
    aboutAiStep3Intro: '最终得分综合了四个信号：',
    aboutScore1Label: '0.50 × 语义匹配',
    aboutScore1Desc: '归一化的余弦相似度',
    aboutScore2Label: '0.25 × 类别匹配',
    aboutScore2Desc: '类别是否与提取的需求匹配？',
    aboutScore3Label: '0.15 × 标签重叠',
    aboutScore3Desc: '提取的标签在资源中出现的比例',
    aboutScore4Label: '0.10 × 紧急度加成',
    aboutScore4Desc: '学生紧急 且 资源紧急',
    aboutAiStep3Outro:
      '评分后，按类别多样化选出前 5 个（同一类别最多 2 个），这样有多种需求的学生就不会得到同质化的结果列表。',
    aboutAiStep4Body:
      '前 5 个资源连同提取的需求会再次发送给 GPT-4o-mini（同样使用类型化工具），为每个资源生成 1–2 句解释，以及引用学生原话的 2–4 步有序行动计划。',
    aboutAiStep5: '高级选项：两轮批评、AI 重新排名 & iCal 导出',
    aboutAiStep5Body:
      '三个可选标志扩展了核心流程。two_pass 在需求提取后立即发送第二次 GPT-4o-mini 调用——模型审视自己的输出，以发现错误的紧急标记和遗漏的类别。use_ai_ranker 用 LLM 传递替换余弦排序器，直接读取完整的需求列表并选择最合适的资源。一旦结果到达，生成的行动计划可下载为符合标准的 .ics 日历文件，在任何日历应用中自动安排每个步骤。',
    aboutBuiltBy:
      'CSS 382——人工智能导论 · 2026 春季 · 一个两人 DYOP 团队。源代码见 ',
    aboutBuiltBySuffix: '。',
    categoryLabels: {
      academic: '辅导与学业支持',
      wellness: '身心健康与咨询',
      basic_needs: '食物与基本需求',
      transportation: '交通与通勤',
      study_space: '学习空间',
      career: '职业与校内工作',
      financial: '经济支持',
    },
  },
  vi: {
    placeholder:
      'vd. Tôi đang choáng ngợp, tụt hậu môn Toán, và cần một nơi yên tĩnh để học.',
    submit: 'Tìm tài nguyên',
    loading: 'Đang tìm tài nguyên…',
    findResources: 'Tìm tài nguyên',
    whatDoYouNeed: 'Bạn cần giúp đỡ gì?',
    campusLabel: 'Cơ sở',
    campusAll: 'Tất cả cơ sở',
    shareQueryLabel: 'Chia sẻ câu hỏi này ẩn danh (giúp ích cho các sinh viên khác)',
    compareCampuses: 'So sánh các cơ sở',
    singleSearch: 'Cơ sở đơn',
    ex1: 'Tôi đang căng thẳng, tụt hậu môn Toán và cần nơi yên tĩnh để học.',
    ex2: 'Tôi đi từ Lynnwood và cần giúp đỡ trả tiền xe buýt.',
    ex3: 'Tôi sắp hết tiền mua thực phẩm và tiền thuê nhà sẽ đến hạn tuần tới.',
    ex4: 'Tôi là sinh viên chuyển trường đang tìm thực tập nhưng hồ sơ còn sơ sài.',
    heroTagline:
      'Công cụ tìm kiếm tài nguyên AI dành cho sinh viên UW. Mô tả tình huống của bạn và chúng tôi sẽ chỉ cho bạn tài nguyên phù hợp và bước tiếp theo rõ ràng.',
    aboutLink: 'Giới thiệu / Cách hoạt động →',
    recentQueries: 'Câu hỏi gần đây của sinh viên',
    nextSteps: 'Các bước tiếp theo của bạn tuần này',
    downloadCal: 'Thêm vào lịch (.ics)',
    whatWeHeard: 'Chúng tôi đã nghe',
    recommended: 'Tài nguyên được đề xuất',
    urgentTitle: 'Tình huống của bạn có vẻ khẩn cấp.',
    urgentBody:
      'Nếu bạn đang trong khủng hoảng, hãy gọi Husky HelpLine (24/7) hoặc SafeCampus.',
    noCategoryMatch:
      'Chúng tôi không chắc danh mục nào phù hợp — các đề xuất dựa trên sự tương đồng tổng thể với tài nguyên UW.',
    intensityLabel: 'Mức độ',
    confLabel: 'Tin cậy',
    noResults: 'Không có kết quả',
    matchPct: 'phù hợp',
    helpful: 'Hữu ích',
    notHelpful: 'Không phải thứ tôi cần',
    feedbackThanks: 'Cảm ơn phản hồi của bạn!',
    feedbackNoted: 'Đã ghi nhận — chúng tôi sẽ cải thiện.',
    share: 'Chia sẻ',
    copied: 'Đã sao chép!',
    aboutResourceLink: 'Giới thiệu',
    scoreBreakdown: 'Chi tiết điểm số',
    advisorMode: 'Chế độ cố vấn',
    advisorBannerDetail:
      'Tất cả điểm số và tài nguyên được trả về. Thêm ?advisor=1 vào URL để duy trì chế độ này.',
    allScores: 'Tất cả tài nguyên và điểm số',
    footerDisclaimer:
      'UW Compass là dự án sinh viên CSS 382. Nó cung cấp tài nguyên UW chính thức nhưng không thay thế chúng. Trong trường hợp khẩn cấp, hãy gọi 911 hoặc liên hệ SafeCampus.',
    aboutNavBack: '← Quay lại UW Compass',
    aboutNavGitHub: 'Kho GitHub ↗',
    aboutPageTitle: 'Giới thiệu UW Compass',
    aboutPageSubtitle:
      'Dự án CSS 382 (Nhập môn AI) giúp sinh viên UW tìm đúng tài nguyên campus bằng cách mô tả tình huống bằng ngôn ngữ tự nhiên.',
    aboutFooterBack: '← Quay lại ứng dụng',
    aboutFooterCopyright: '© 2026 UW Compass',
    aboutSec1: 'Tổng quan & động lực',
    aboutSec2: 'Tác động đến cộng đồng UW',
    aboutSec3: 'Kiến trúc hệ thống',
    aboutSec4: 'Công nghệ sử dụng',
    aboutSec5: 'AI hoạt động như thế nào',
    aboutSec6: 'Hướng dẫn sử dụng',
    aboutSec7: 'Các danh mục chúng tôi hỗ trợ',
    aboutSec8: 'Nhóm phát triển',
    aboutAiStep1: 'Trích xuất nhu cầu',
    aboutAiStep2: 'Truy xuất ngữ nghĩa',
    aboutAiStep3: 'Xếp hạng đa tín hiệu',
    aboutAiStep4: 'Giải thích từng tài nguyên + bước tiếp theo',
    aboutImpact1: 'giảm thời gian sinh viên tìm kiếm sự giúp đỡ;',
    aboutImpact2: 'làm cho các dịch vụ UW hiện có dễ khám phá hơn;',
    aboutImpact3:
      'cho phép sinh viên mô tả nhu cầu bằng ngôn ngữ đơn giản thay vì tên văn phòng;',
    aboutImpact4: 'cung cấp tóm tắt ngắn và đề xuất bước tiếp theo trực tiếp;',
    aboutImpact5:
      'hỗ trợ những sinh viên đang bị choáng ngợp và cần con đường hành động rõ ràng hơn.',
    aboutDisclaimerText:
      'UW Compass không thay thế tài nguyên UW chính thức. Mỗi đề xuất đều liên kết đến văn phòng hoặc trang UW tương ứng. Đây là lớp định hướng, không phải dịch vụ độc lập. Trong trường hợp khẩn cấp, sinh viên được hướng đến SafeCampus và Husky HelpLine (24/7).',
    aboutGuide1: 'Truy cập trang chủ.',
    aboutGuide2:
      'Mô tả tình huống bằng từ ngữ của bạn. Hãy thành thật về điều gì đang khó — "Tôi căng thẳng và tụt hậu môn Toán" hiệu quả hơn "Tôi cần gia sư."',
    aboutGuide3:
      'Nhấp vào Tìm tài nguyên. Yêu cầu đầu tiên mất khoảng 3–5 giây (ba lần gọi OpenAI).',
    aboutGuide4:
      'Đọc phần Chúng tôi đã nghe trước — đó là cách AI diễn giải. Nếu sai, hãy diễn đạt lại và thử lại.',
    aboutGuide5:
      'Nhấp vào bất kỳ đề xuất nào để truy cập trang UW chính thức. Danh sách Các bước tiếp theo là thứ tự được khuyến nghị để hành động.',
    aboutCrisisTitle: 'Đây không phải dịch vụ khẩn cấp.',
    aboutCrisisBody:
      'Gọi 911 cho trường hợp khẩn cấp. Gọi Husky HelpLine (24/7) cho hỗ trợ sức khỏe tâm thần. Liên hệ SafeCampus cho mối lo ngại về an toàn.',
    aboutOverviewP1:
      'UW có nhiều dịch vụ hỗ trợ hơn những gì hầu hết sinh viên biết — gia sư, tư vấn, an ninh lương thực, giao thông, không gian học tập, hỗ trợ nghề nghiệp, hỗ trợ tài chính. Vấn đề không phải là sự sẵn có; mà là sự phân mảnh. Mỗi văn phòng có trang web riêng, biểu mẫu tiếp nhận riêng, thuật ngữ riêng. Một sinh viên gặp khó khăn thường biết điều gì đang sai ("Tôi quá tải và tụt hậu môn Toán"), chứ không biết nên gửi email cho văn phòng nào.',
    aboutOverviewP2:
      'UW Compass thu hẹp khoảng cách đó. Bạn mô tả tình huống bằng lời của chính mình. Ứng dụng trích xuất các nhu cầu cơ bản, đối chiếu chúng với một tập hợp được tuyển chọn gồm {count} tài nguyên UW chính thức, và đưa ra các đề xuất được xếp hạng kèm một kế hoạch hành động ngắn gọn.',
    aboutImpactIntro:
      'Những sinh viên bị ảnh hưởng nặng nề nhất bởi sự phân mảnh tài nguyên thường là những người có ít thời gian nhất để xoay xở: sinh viên năm nhất, sinh viên chuyển trường, người đi học xa, và những sinh viên cùng lúc gánh áp lực học tập, tài chính và sức khỏe. UW Compass mang lại lợi ích cho họ bằng cách:',
    aboutArchIntro:
      'Một ứng dụng Next.js duy nhất. Frontend là một biểu mẫu nhỏ phía máy khách; backend là một route API duy nhất chạy trên Node. Không có máy chủ cơ sở dữ liệu riêng — tập tài nguyên được tuyển chọn và các embedding tính sẵn của nó nằm trong gói triển khai dưới dạng tệp JSON, được tạo lại bằng npm run seed.',
    aboutArchNoteLabel: 'Lưu ý:',
    aboutArchNoteBody:
      'Ba lần gọi OpenAI cho mỗi yêu cầu: 1 embedding + 2 chat completion. Hai lần đầu chạy song song. Embedding tài nguyên được tính một lần khi seed, không bao giờ tính theo từng yêu cầu.',
    aboutFlowClient: 'Trình duyệt (Máy khách)',
    aboutFlowParallel: 'Xử lý song song',
    aboutFlowWait: 'Chờ',
    aboutFlowRanking: 'Xếp hạng',
    aboutFlowRender: 'Trình duyệt (Hiển thị giao diện)',
    aboutFlowCapEmbedding: '(embedding đầu vào)',
    aboutFlowCapNeed: '(trích xuất nhu cầu)',
    aboutFlowCapPrecomputed: '(embedding tính sẵn)',
    aboutFlowCapExplain: '(lý do từng tài nguyên + bước tiếp theo)',
    aboutTechFrontend: 'Frontend',
    aboutTechApi: 'API',
    aboutTechEmbeddings: 'Embeddings',
    aboutTechNeedExtraction: 'Trích xuất nhu cầu',
    aboutTechStorage: 'Lưu trữ',
    aboutTechStorageDetail: 'Tài nguyên: JSON tĩnh trong gói · Thư viện & phản hồi: Supabase (Postgres)',
    aboutTechTesting: 'Kiểm thử',
    aboutTechTestingDetail: 'Vitest — 83 bài kiểm thử trong 7 tệp (bộ xếp hạng, schema, kịch bản, i18n, iCal, giới hạn tốc độ, lọc cơ sở)',
    aboutTechHosting: 'Lưu trữ web',
    aboutTechHostingDetail: 'Vercel (frontend + API serverless)',
    aboutTechQuality: 'Chất lượng',
    aboutTechQualityDetail: 'GitHub Actions CI trên mỗi lần push & PR; kiểm tra sức khỏe liên kết tự động hàng tuần',
    aboutAiStep1Body:
      'Văn bản tự do của sinh viên được gửi đến GPT-4o-mini cùng một định nghĩa công cụ có kiểu. Mô hình phải trả về các nhu cầu có cấu trúc — mỗi nhu cầu gồm một category, một intensity (1–5), bằng chứng hỗ trợ từ đầu vào, các tags chi tiết (snake_case), và một boolean urgent cho các tình huống quan trọng về an toàn. Không có JSON tự do, không có sự mong manh khi phân tích.',
    aboutAiStep2Body:
      'Cùng một đầu vào cũng được nhúng thành một vector 1536 chiều. Mỗi tài nguyên có một embedding tính sẵn (tên + danh mục + mô tả + thẻ). Chúng tôi tính độ tương đồng cosine giữa đầu vào và mọi tài nguyên — nhanh vì chúng tôi chỉ có {count} tài nguyên, không cần cơ sở dữ liệu vector.',
    aboutAiStep3Intro: 'Điểm cuối cùng kết hợp bốn tín hiệu:',
    aboutScore1Label: '0.50 × Khớp ngữ nghĩa',
    aboutScore1Desc: 'Độ tương đồng cosine đã chuẩn hóa',
    aboutScore2Label: '0.25 × Khớp danh mục',
    aboutScore2Desc: 'Danh mục có khớp với một nhu cầu đã trích xuất không?',
    aboutScore3Label: '0.15 × Trùng lặp thẻ',
    aboutScore3Desc: 'Tỷ lệ các thẻ đã trích xuất có trong tài nguyên',
    aboutScore4Label: '0.10 × Tăng theo mức khẩn cấp',
    aboutScore4Desc: 'Sinh viên khẩn cấp VÀ tài nguyên khẩn cấp',
    aboutAiStep3Outro:
      'Sau khi chấm điểm, 5 kết quả hàng đầu được chọn với sự đa dạng hóa danh mục (tối đa 2 từ bất kỳ một danh mục nào) để một sinh viên có nhiều nhu cầu không nhận được danh sách kết quả đồng nhất.',
    aboutAiStep4Body:
      'Top 5 tài nguyên cùng với các nhu cầu đã trích xuất được gửi lại cho GPT-4o-mini (lại với một công cụ có kiểu) để tạo ra lời giải thích 1–2 câu cho mỗi tài nguyên và một kế hoạch hành động có thứ tự gồm 2–4 bước tham chiếu đến lời của sinh viên.',
    aboutAiStep5: 'Tùy chọn nâng cao: hai lượt phê bình, AI xếp hạng lại & xuất iCal',
    aboutAiStep5Body:
      'Ba cờ tùy chọn mở rộng quy trình cốt lõi. two_pass gửi lần gọi GPT-4o-mini thứ hai ngay sau khi trích xuất nhu cầu — mô hình xem xét lại kết quả của chính mình để phát hiện cờ khẩn cấp sai và các danh mục bị bỏ sót. use_ai_ranker thay thế bộ xếp hạng cosine bằng một lượt LLM đọc toàn bộ danh sách nhu cầu và chọn trực tiếp các tài nguyên phù hợp nhất. Sau khi có kết quả, kế hoạch hành động có thể tải xuống dưới dạng tệp .ics tuân thủ tiêu chuẩn, tự động lên lịch từng bước trong bất kỳ ứng dụng lịch nào.',
    aboutBuiltBy:
      'CSS 382 — Nhập môn AI · Mùa xuân 2026 · Một nhóm DYOP hai người. Mã nguồn trên ',
    aboutBuiltBySuffix: '.',
    categoryLabels: {
      academic: 'Gia sư & Hỗ trợ học tập',
      wellness: 'Sức khỏe & Tư vấn',
      basic_needs: 'Thực phẩm & Nhu cầu cơ bản',
      transportation: 'Giao thông & Đi lại',
      study_space: 'Không gian học tập',
      career: 'Nghề nghiệp & Việc làm trong trường',
      financial: 'Hỗ trợ tài chính',
    },
  },
  ko: {
    placeholder: '예: 수학에 뒤처지고 조용히 공부할 공간이 필요합니다.',
    submit: '자료 찾기',
    loading: '자료를 찾고 있습니다…',
    findResources: '자료 찾기',
    whatDoYouNeed: '어떤 도움이 필요하신가요?',
    campusLabel: '캠퍼스',
    campusAll: '모든 캠퍼스',
    shareQueryLabel: '이 질문을 익명으로 공유 (다른 학생들에게 도움이 됩니다)',
    compareCampuses: '캠퍼스 비교',
    singleSearch: '단일 캠퍼스',
    ex1: '스트레스받고 수학에 뒤처져 있으며 조용히 공부할 공간이 필요합니다.',
    ex2: 'Lynnwood에서 통학하고 있으며 버스 요금 지원이 필요합니다.',
    ex3: '식비가 부족하고 다음 주에 월세 납부 기한입니다.',
    ex4: '편입생으로 인턴십을 찾고 있는데 이력서가 아직 미흡합니다.',
    heroTagline:
      'UW 학생을 위한 AI 자료 검색 도구입니다. 현재 상황을 설명하면 적합한 캠퍼스 자료와 명확한 다음 단계를 안내해 드립니다.',
    aboutLink: '소개 / 작동 방식 →',
    recentQueries: '최근 학생 질문',
    nextSteps: '이번 주 다음 단계',
    downloadCal: '캘린더에 추가 (.ics)',
    whatWeHeard: '파악한 내용',
    recommended: '추천 자료',
    urgentTitle: '상황이 시급해 보입니다.',
    urgentBody: '위기 상황이라면 Husky HelpLine(24/7) 또는 SafeCampus에 연락하세요.',
    noCategoryMatch:
      '어떤 카테고리가 맞는지 확인하기 어려웠습니다 — 아래 추천은 UW 자료와의 전체적인 유사도를 기반으로 합니다.',
    intensityLabel: '강도',
    confLabel: '신뢰도',
    noResults: '결과 없음',
    matchPct: '일치',
    helpful: '도움이 됨',
    notHelpful: '원하는 내용이 아님',
    feedbackThanks: '피드백 감사합니다!',
    feedbackNoted: '확인했습니다 — 개선하겠습니다.',
    share: '공유',
    copied: '복사됨!',
    aboutResourceLink: '소개',
    scoreBreakdown: '점수 세부 내역',
    advisorMode: '어드바이저 모드',
    advisorBannerDetail:
      '모든 점수와 자료가 반환됩니다. URL에 ?advisor=1을 추가하면 이 모드가 유지됩니다.',
    allScores: '모든 자료 및 점수',
    footerDisclaimer:
      'UW Compass는 CSS 382 학생 프로젝트입니다. 공식 UW 자료를 제공하지만 대체제는 아닙니다. 긴급 상황에는 911에 전화하거나 SafeCampus에 연락하세요.',
    aboutNavBack: '← UW Compass로 돌아가기',
    aboutNavGitHub: 'GitHub 저장소 ↗',
    aboutPageTitle: 'UW Compass 소개',
    aboutPageSubtitle:
      'CSS 382 (AI 입문) 과목의 프로젝트로, UW 학생들이 자신의 상황을 일상 언어로 설명하여 적합한 캠퍼스 자원을 찾을 수 있도록 돕습니다.',
    aboutFooterBack: '← 앱으로 돌아가기',
    aboutFooterCopyright: '© 2026 UW Compass',
    aboutSec1: '개요 및 동기',
    aboutSec2: 'UW 커뮤니티 영향',
    aboutSec3: '아키텍처',
    aboutSec4: '기술 스택',
    aboutSec5: 'AI 작동 방식',
    aboutSec6: '사용 가이드',
    aboutSec7: '지원 카테고리',
    aboutSec8: '제작자',
    aboutAiStep1: '필요 사항 추출',
    aboutAiStep2: '의미론적 검색',
    aboutAiStep3: '다중 신호 순위 결정',
    aboutAiStep4: '자원별 설명 + 다음 단계',
    aboutImpact1: '학생들이 도움을 찾는 데 걸리는 시간 단축;',
    aboutImpact2: '기존 UW 서비스를 더 쉽게 발견할 수 있도록 지원;',
    aboutImpact3: '학생들이 사무소 이름 대신 일상 언어로 필요를 설명할 수 있게 함;',
    aboutImpact4: '짧은 요약과 직접적인 다음 단계 추천 제공;',
    aboutImpact5: '압도감을 느끼고 명확한 행동 경로가 필요한 학생 지원.',
    aboutDisclaimerText:
      'UW Compass는 공식 UW 자료를 대체하지 않습니다. 모든 추천은 해당 UW 사무소나 페이지로 연결됩니다. 라우팅 레이어이며 독립적인 서비스가 아닙니다. 긴급 상황에서는 학생들이 SafeCampus 및 Husky HelpLine(24/7)으로 안내됩니다.',
    aboutGuide1: '홈 페이지로 이동합니다.',
    aboutGuide2:
      '자신의 말로 상황을 설명하세요. 어려운 점을 솔직하게 말하세요 — "수학에 뒤처져 있고 스트레스받고 있어요"가 "과외가 필요해요"보다 효과적입니다.',
    aboutGuide3:
      '자료 찾기를 클릭하세요. 첫 번째 요청은 약 3–5초 걸립니다(세 번의 OpenAI 호출).',
    aboutGuide4:
      '먼저 파악한 내용 섹션을 읽으세요 — 그것이 AI의 해석입니다. 틀렸다면 다시 표현하고 재시도하세요.',
    aboutGuide5:
      '추천 항목을 클릭하면 공식 UW 페이지로 이동합니다. 이번 주 다음 단계 목록이 추천 실행 순서입니다.',
    aboutCrisisTitle: '이것은 위기 서비스가 아닙니다.',
    aboutCrisisBody:
      '응급 상황에는 911에 전화하세요. 정신 건강 지원은 Husky HelpLine (24/7)에 전화하세요. 안전 문제는 SafeCampus에 연락하세요.',
    aboutOverviewP1:
      'UW에는 대부분의 학생이 아는 것보다 더 많은 지원 서비스가 있습니다 — 튜터링, 상담, 식품 지원, 교통, 학습 공간, 진로 지원, 재정 지원. 문제는 서비스의 유무가 아니라 분산입니다. 각 부서는 자체 웹사이트, 자체 신청 양식, 자체 용어를 운영합니다. 어려움을 겪는 학생은 보통 무엇이 잘못되었는지는 알지만("벅차고 수학에 뒤처져 있어요"), 어느 부서에 이메일을 보내야 할지는 모릅니다.',
    aboutOverviewP2:
      'UW Compass는 그 간극을 메웁니다. 자신의 말로 상황을 입력하면, 앱이 근본적인 필요를 추출하고 엄선된 {count}개의 공식 UW 자원과 대조하여, 짧은 실행 계획과 함께 순위가 매겨진 추천을 제공합니다.',
    aboutImpactIntro:
      '자원 분산으로 가장 큰 타격을 받는 학생들은 대개 그것을 헤쳐 나갈 시간이 가장 적은 사람들입니다: 1학년 학생, 편입생, 통학생, 그리고 학업·재정·웰빙 압박을 동시에 감당하는 학생들입니다. UW Compass는 다음과 같은 방식으로 이들을 돕습니다:',
    aboutArchIntro:
      '하나의 Next.js 애플리케이션입니다. 프론트엔드는 작은 클라이언트 측 양식이고, 백엔드는 Node에서 실행되는 단일 API 라우트입니다. 별도의 데이터베이스 서버는 없습니다 — 엄선된 자원 집합과 사전 계산된 임베딩은 JSON 파일로 배포 번들에 포함되며, npm run seed로 재생성됩니다.',
    aboutArchNoteLabel: '참고:',
    aboutArchNoteBody:
      '요청당 세 번의 OpenAI 호출: 임베딩 1회 + 채팅 완성 2회. 처음 두 개는 병렬로 실행됩니다. 자원 임베딩은 seed 시점에 한 번만 계산되며, 요청마다 계산하지 않습니다.',
    aboutFlowClient: '브라우저 (클라이언트)',
    aboutFlowParallel: '병렬 처리',
    aboutFlowWait: '대기',
    aboutFlowRanking: '순위 결정',
    aboutFlowRender: '브라우저 (UI 렌더링)',
    aboutFlowCapEmbedding: '(입력 임베딩)',
    aboutFlowCapNeed: '(필요 추출)',
    aboutFlowCapPrecomputed: '(사전 계산된 임베딩)',
    aboutFlowCapExplain: '(자원별 이유 + 다음 단계)',
    aboutTechFrontend: '프론트엔드',
    aboutTechApi: 'API',
    aboutTechEmbeddings: '임베딩',
    aboutTechNeedExtraction: '필요 추출',
    aboutTechStorage: '저장소',
    aboutTechStorageDetail: '리소스: 배포 번들의 정적 JSON · 갤러리 & 피드백: Supabase (Postgres)',
    aboutTechTesting: '테스트',
    aboutTechTestingDetail: 'Vitest — 7개 파일에 걸쳐 83개 테스트 (랭커, 스키마, 시나리오, i18n, iCal, 속도 제한, 캠퍼스 필터)',
    aboutTechHosting: '호스팅',
    aboutTechHostingDetail: 'Vercel (프론트엔드 + 서버리스 API)',
    aboutTechQuality: '품질',
    aboutTechQualityDetail: 'GitHub Actions CI (모든 push & PR); 주간 자동 링크 상태 검사',
    aboutAiStep1Body:
      '학생의 자유 텍스트 입력은 타입이 지정된 도구 정의와 함께 GPT-4o-mini로 전송됩니다. 모델은 구조화된 필요를 반환해야 합니다 — 각 항목에는 category, intensity(1–5), 입력에서 가져온 근거, 세분화된 tags(snake_case), 그리고 안전이 중요한 상황을 위한 urgent 불리언이 포함됩니다. 자유 형식 JSON이 없고, 파싱의 취약성도 없습니다.',
    aboutAiStep2Body:
      '동일한 입력은 1536차원 벡터로도 임베딩됩니다. 모든 자원에는 사전 계산된 임베딩(이름 + 카테고리 + 설명 + 태그)이 있습니다. 입력과 모든 자원 간의 코사인 유사도를 계산합니다 — 자원이 {count}개뿐이라 빠르며, 벡터 데이터베이스가 필요 없습니다.',
    aboutAiStep3Intro: '최종 점수는 네 가지 신호를 결합합니다:',
    aboutScore1Label: '0.50 × 의미 일치',
    aboutScore1Desc: '정규화된 코사인 유사도',
    aboutScore2Label: '0.25 × 카테고리 일치',
    aboutScore2Desc: '카테고리가 추출된 필요와 일치하는가?',
    aboutScore3Label: '0.15 × 태그 중복',
    aboutScore3Desc: '추출된 태그가 자원에 존재하는 비율',
    aboutScore4Label: '0.10 × 긴급도 가산',
    aboutScore4Desc: '학생이 긴급하고 그리고 자원도 긴급함',
    aboutAiStep3Outro:
      '점수 산정 후, 카테고리 다양화(한 카테고리당 최대 2개)를 적용해 상위 5개를 선택하므로, 여러 필요가 있는 학생이 동질적인 결과 목록을 받지 않습니다.',
    aboutAiStep4Body:
      '상위 5개 자원과 추출된 필요가 (다시 타입이 지정된 도구와 함께) GPT-4o-mini로 돌아가, 자원당 1–2문장의 설명과 학생의 말을 참조한 2–4단계의 순서가 있는 실행 계획을 생성합니다.',
    aboutAiStep5: '고급 옵션: 두 번 비평, AI 재순위 결정 & iCal 내보내기',
    aboutAiStep5Body:
      '세 가지 선택적 플래그가 핵심 파이프라인을 확장합니다. two_pass는 필요 추출 직후 GPT-4o-mini를 두 번째로 호출합니다 — 모델이 자신의 출력을 검토하여 잘못된 긴급 플래그와 누락된 카테고리를 잡아냅니다. use_ai_ranker는 코사인 랭커를 LLM 패스로 대체하여 전체 필요 목록을 읽고 가장 적합한 자원을 직접 선택합니다. 결과가 도착하면 생성된 실행 계획을 표준 준수 .ics 캘린더 파일로 다운로드하여 모든 캘린더 앱에서 각 단계를 자동으로 예약할 수 있습니다.',
    aboutBuiltBy:
      'CSS 382 — AI 입문 · 2026년 봄 · 2인 DYOP 팀. 소스 코드는 ',
    aboutBuiltBySuffix: '에 있습니다.',
    categoryLabels: {
      academic: '튜터링 & 학업 지원',
      wellness: '웰빙 & 상담',
      basic_needs: '식품 & 기본 필요',
      transportation: '교통 & 통학',
      study_space: '학습 공간',
      career: '진로 & 캠퍼스 일자리',
      financial: '재정 지원',
    },
  },
};

export function getStrings(locale: Locale): UIStrings {
  return strings[locale] ?? strings.en;
}

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.slice(0, 2).toLowerCase() as Locale;
  return SUPPORTED_LOCALES.includes(lang) ? lang : 'en';
}
