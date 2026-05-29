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
