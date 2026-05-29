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
  placeholder: string;
  submit: string;
  loading: string;
  findResources: string;
  whatDoYouNeed: string;
  campusLabel: string;
  shareQueryLabel: string;
  nextSteps: string;
  downloadCal: string;
  whatWeHeard: string;
  recommended: string;
  urgentTitle: string;
  urgentBody: string;
  helpful: string;
  notHelpful: string;
  compareCampuses: string;
  singleSearch: string;
  advisorMode: string;
  allScores: string;
  matchPct: string;
  recentQueries: string;
  aboutLink: string;
}

const strings: Record<Locale, UIStrings> = {
  en: {
    placeholder: "e.g. I'm overwhelmed, behind in math, and need a quiet place to study.",
    submit: 'Find resources',
    loading: 'Finding resources…',
    findResources: 'Find resources',
    whatDoYouNeed: 'What do you need help with?',
    campusLabel: 'Campus',
    shareQueryLabel: 'Share this query anonymously (helps other students)',
    nextSteps: 'Your next steps this week',
    downloadCal: 'Add to calendar (.ics)',
    whatWeHeard: 'What we heard',
    recommended: 'Recommended resources',
    urgentTitle: 'Your situation sounds time-sensitive.',
    urgentBody: "If you're in crisis, call the Husky HelpLine (24/7) or SafeCampus.",
    helpful: 'Helpful',
    notHelpful: 'Not what I needed',
    compareCampuses: 'Compare campuses',
    singleSearch: 'Single campus',
    advisorMode: 'Advisor mode',
    allScores: 'All resources & scores',
    matchPct: 'match',
    recentQueries: 'Recent student questions',
    aboutLink: 'About / How it works →',
  },
  es: {
    placeholder: 'ej. Estoy agobiado, atrasado en matemáticas y necesito un lugar tranquilo para estudiar.',
    submit: 'Buscar recursos',
    loading: 'Buscando recursos…',
    findResources: 'Buscar recursos',
    whatDoYouNeed: '¿Con qué necesitas ayuda?',
    campusLabel: 'Campus',
    shareQueryLabel: 'Compartir esta consulta de forma anónima (ayuda a otros estudiantes)',
    nextSteps: 'Tus próximos pasos esta semana',
    downloadCal: 'Agregar al calendario (.ics)',
    whatWeHeard: 'Lo que escuchamos',
    recommended: 'Recursos recomendados',
    urgentTitle: 'Tu situación parece urgente.',
    urgentBody: 'Si estás en crisis, llama a Husky HelpLine (24/7) o SafeCampus.',
    helpful: 'Útil',
    notHelpful: 'No era lo que necesitaba',
    compareCampuses: 'Comparar campus',
    singleSearch: 'Campus único',
    advisorMode: 'Modo asesor',
    allScores: 'Todos los recursos y puntajes',
    matchPct: 'coincidencia',
    recentQueries: 'Preguntas recientes de estudiantes',
    aboutLink: 'Acerca / Cómo funciona →',
  },
  zh: {
    placeholder: '例如：我不知所措，数学落后，需要一个安静的学习场所。',
    submit: '查找资源',
    loading: '正在查找资源…',
    findResources: '查找资源',
    whatDoYouNeed: '您需要什么帮助？',
    campusLabel: '校区',
    shareQueryLabel: '匿名分享此查询（帮助其他学生）',
    nextSteps: '本周行动计划',
    downloadCal: '添加到日历 (.ics)',
    whatWeHeard: '我们的理解',
    recommended: '推荐资源',
    urgentTitle: '您的情况似乎很紧急。',
    urgentBody: '如遇危机，请拨打 Husky HelpLine（24/7）或联系 SafeCampus。',
    helpful: '有帮助',
    notHelpful: '不是我需要的',
    compareCampuses: '比较校区',
    singleSearch: '单一校区',
    advisorMode: '顾问模式',
    allScores: '所有资源和评分',
    matchPct: '匹配',
    recentQueries: '近期学生提问',
    aboutLink: '关于 / 工作原理 →',
  },
  vi: {
    placeholder: 'vd. Tôi đang choáng ngợp, tụt hậu môn Toán, và cần một nơi yên tĩnh để học.',
    submit: 'Tìm tài nguyên',
    loading: 'Đang tìm tài nguyên…',
    findResources: 'Tìm tài nguyên',
    whatDoYouNeed: 'Bạn cần giúp đỡ gì?',
    campusLabel: 'Cơ sở',
    shareQueryLabel: 'Chia sẻ câu hỏi này ẩn danh (giúp ích cho các sinh viên khác)',
    nextSteps: 'Các bước tiếp theo của bạn tuần này',
    downloadCal: 'Thêm vào lịch (.ics)',
    whatWeHeard: 'Chúng tôi đã nghe',
    recommended: 'Tài nguyên được đề xuất',
    urgentTitle: 'Tình huống của bạn có vẻ khẩn cấp.',
    urgentBody: 'Nếu bạn đang trong khủng hoảng, hãy gọi Husky HelpLine (24/7) hoặc SafeCampus.',
    helpful: 'Hữu ích',
    notHelpful: 'Không phải thứ tôi cần',
    compareCampuses: 'So sánh các cơ sở',
    singleSearch: 'Cơ sở đơn',
    advisorMode: 'Chế độ cố vấn',
    allScores: 'Tất cả tài nguyên và điểm số',
    matchPct: 'phù hợp',
    recentQueries: 'Câu hỏi gần đây của sinh viên',
    aboutLink: 'Giới thiệu / Cách hoạt động →',
  },
  ko: {
    placeholder: '예: 수학에 뒤처지고 조용히 공부할 공간이 필요합니다.',
    submit: '자료 찾기',
    loading: '자료를 찾고 있습니다…',
    findResources: '자료 찾기',
    whatDoYouNeed: '어떤 도움이 필요하신가요?',
    campusLabel: '캠퍼스',
    shareQueryLabel: '이 질문을 익명으로 공유 (다른 학생들에게 도움이 됩니다)',
    nextSteps: '이번 주 다음 단계',
    downloadCal: '캘린더에 추가 (.ics)',
    whatWeHeard: '파악한 내용',
    recommended: '추천 자료',
    urgentTitle: '상황이 시급해 보입니다.',
    urgentBody: '위기 상황이라면 Husky HelpLine(24/7) 또는 SafeCampus에 연락하세요.',
    helpful: '도움이 됨',
    notHelpful: '원하는 내용이 아님',
    compareCampuses: '캠퍼스 비교',
    singleSearch: '단일 캠퍼스',
    advisorMode: '어드바이저 모드',
    allScores: '모든 자료 및 점수',
    matchPct: '일치',
    recentQueries: '최근 학생 질문',
    aboutLink: '소개 / 작동 방식 →',
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
