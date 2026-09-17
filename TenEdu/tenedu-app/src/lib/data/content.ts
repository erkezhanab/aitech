// Static content — module 1 "Компьютер с нуля"
// Same JSON structure as Supabase slides/quiz_questions tables

export interface SlideContent {
  id: string;
  module_id: string;
  sort_order: number;
  slide_type: "title" | "checklist" | "content" | "interactive" | "summary";
  content: Record<string, unknown>;
  video_url?: string | null;
}

export interface QuizQuestion {
  id: string;
  module_id: string;
  sort_order: number;
  question: string;
  question_type: "single" | "multiple";
  options: string[];
  correct: number[];
  explanation?: string;
}

export interface ModuleData {
  id: string;
  track_id: string;
  title: string;
  description: string;
  what_you_learn: string[];
  main_idea: string;
  sort_order: number;
  is_published: boolean;
}

export interface TrackData {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  sort_order: number;
  is_children_only: boolean;
  modules: ModuleData[];
}

// ── SEED DATA ─────────────────────────────────────────────────

export const STATIC_TRACKS: TrackData[] = [
  {
    id: "track-1",
    slug: "digital-basics",
    title: "Базалық цифрлық сауаттылық",
    description: "Компьютерді нөлден үйрен: құжаттар, email, интернет және ақпаратты тексеру",
    emoji: "💻",
    color: "blue",
    sort_order: 1,
    is_children_only: false,
    modules: [
      {
        id: "module-1-1",
        track_id: "track-1",
        title: "Компьютер с нуля",
        description: "Компьютердің негізгі бөліктерін, оны қосу мен өшіруді, жұмыс үстелімен жұмыс жасауды үйренеміз.",
        what_you_learn: [
          "Компьютердің негізгі бөліктерін атай аласыз",
          "Компьютерді қауіпсіз қосып, өше аласыз",
          "Жұмыс үстелінде шарлай аласыз",
          "Тышқан мен пернетақтаны дұрыс пайдалана аласыз",
          "Файлдар мен қалталармен жұмыс жасай аласыз",
        ],
        main_idea: "«Компьютер — бұл бір зат емес, ол — командаларды тыңдайтын жақсы достың сияқты.»",
        sort_order: 1,
        is_published: true,
      },
      {
        id: "module-1-2",
        track_id: "track-1",
        title: "Интернетте ақпарат іздеу",
        description: "Google арқылы іздеу, сенімді сайттарды тану, ақпаратты тексеру.",
        what_you_learn: [
          "Google-де тиімді іздеу сұрауын жаза аласыз",
          "Сенімді сайттарды жалған сайттардан ажырата аласыз",
          "Ақпаратты бірнеше дереккөзден тексере аласыз",
        ],
        main_idea: "«Интернет — кітапхана сияқты. Дұрыс кітапты табу — дағды.»",
        sort_order: 2,
        is_published: true,
      },
      {
        id: "module-1-3",
        track_id: "track-1",
        title: "Электрондық пошта",
        description: "Gmail аккаунт ашу, хат жіберу алу, тіркемелермен жұмыс.",
        what_you_learn: [
          "Gmail аккаунт аша аласыз",
          "Хат жазып жібере аласыз",
          "Файлды тіркеме ретінде қоса аласыз",
          "Спам хаттарды анықтай аласыз",
        ],
        main_idea: "«Email — цифрлық пошта жәшігіңіз. Оны реттей білу — маңызды дағды.»",
        sort_order: 3,
        is_published: true,
      },
    ],
  },
  {
    id: "track-2",
    slug: "digital-life",
    title: "Өмірдегі цифрлық дағдылар",
    description: "eGov.kz, онлайн-банкинг, интернет қауіпсіздігі, алаяқтықтан қорғану",
    emoji: "🏛️",
    color: "green",
    sort_order: 2,
    is_children_only: false,
    modules: [
      {
        id: "module-2-1",
        track_id: "track-2",
        title: "eGov.kz — мемлекеттік қызметтер онлайн",
        description: "eGov.kz порталын пайдаланып, мемлекеттік қызметтерді үйден алу.",
        what_you_learn: [
          "eGov.kz порталына кіре аласыз",
          "ЭЦП алу жолын білесіз",
          "Негізгі қызметтерді онлайн ала аласыз",
        ],
        main_idea: "«eGov.kz — мемлекеттік кеңсеге бармай-ақ бәрін шеше алатын цифрлық терезе.»",
        sort_order: 1,
        is_published: true,
      },
    ],
  },
  {
    id: "track-3",
    slug: "work-and-study",
    title: "Оқу және жұмыс",
    description: "Түйіндеме жазу, жұмыс іздеу онлайн, сұхбат, кодтаудың негіздері",
    emoji: "💼",
    color: "purple",
    sort_order: 3,
    is_children_only: false,
    modules: [
      {
        id: "module-3-1",
        track_id: "track-3",
        title: "Онлайн түйіндеме жазу",
        description: "hh.kz сайтында профиль жасау, жақсы түйіндеме жазу.",
        what_you_learn: [
          "hh.kz-та тіркеле аласыз",
          "Толық түйіндеме жаза аласыз",
          "Жұмысқа өтінім жібере аласыз",
        ],
        main_idea: "«Жақсы түйіндеме — есіктің кілті.»",
        sort_order: 1,
        is_published: true,
      },
    ],
  },
  {
    id: "track-children",
    slug: "first-steps",
    title: "Алғашқы қадамдар",
    description: "8–12 жасқа арналған: компьютер негіздері, интернет қауіпсіздігі",
    emoji: "🌟",
    color: "yellow",
    sort_order: 4,
    is_children_only: true,
    modules: [
      {
        id: "module-c-1",
        track_id: "track-children",
        title: "Компьютер — менің досым!",
        description: "Компьютермен алғаш танысу: бөліктері, ойындар, қауіпсіздік ережелері.",
        what_you_learn: [
          "Компьютердің бөліктерін атай аласың",
          "Тышқан мен пернетақтаны пайдалана аласың",
          "Интернетте қауіпсіз болу ережелерін білесің",
        ],
        main_idea: "«Компьютер — зерттеуге болатын ғажайып құрылғы!»",
        sort_order: 1,
        is_published: true,
      },
    ],
  },
];

// ── MODULE 1-1 SLIDES ─────────────────────────────────────────
export const MODULE_1_1_SLIDES: SlideContent[] = [
  {
    id: "s1",
    module_id: "module-1-1",
    sort_order: 1,
    slide_type: "title",
    content: {
      title: "Компьютер с нуля",
      subtitle: "Бірінші модуль — Базалық цифрлық сауаттылық",
      emoji: "💻",
      track: "Трек 1",
    },
  },
  {
    id: "s2",
    module_id: "module-1-1",
    sort_order: 2,
    slide_type: "checklist",
    content: {
      title: "Осы модульде сіз үйренесіз:",
      items: [
        "Компьютердің қандай бөліктерден тұратынын",
        "Компьютерді қалай қосу және өшіру керектігін",
        "Жұмыс үстелімен қалай жұмыс жасауды",
        "Тышқан мен пернетақтаны дұрыс қолдануды",
        "Файлдар мен қалталармен жұмыс жасауды",
      ],
    },
  },
  {
    id: "s3",
    module_id: "module-1-1",
    sort_order: 3,
    slide_type: "content",
    content: {
      title: "Компьютердің негізгі бөліктері",
      emoji: "🖥️",
      text: "Компьютер бірнеше маңызды бөліктен тұрады. Олардың әрқайсысы өз міндетін атқарады.",
      highlights: [
        { emoji: "🖥️", label: "Монитор", desc: "Ақпаратты экранда көрсетеді" },
        { emoji: "⌨️", label: "Пернетақта", desc: "Мәтін терү үшін қолданылады" },
        { emoji: "🖱️", label: "Тышқан", desc: "Экрандағы нәрсені басу үшін" },
        { emoji: "🗄️", label: "Корпус (системный блок)", desc: "Компьютердің «миы» — барлығы осында" },
      ],
      tip: "💡 Кеңес: Ноутбукта монитор, пернетақта және корпус — бәрі бір тұтас!",
    },
  },
  {
    id: "s4",
    module_id: "module-1-1",
    sort_order: 4,
    slide_type: "content",
    content: {
      title: "Компьютерді қосу және өшіру",
      emoji: "⚡",
      text: "Компьютерді дұрыс қосып, өшіру — маңызды дағды. Бұл қадамдарды ұмытпаңыз!",
      steps: [
        { num: "1", text: "Розеткаға қосылғанын тексеріңіз" },
        { num: "2", text: "Корпустағы дөңгелек батырманы басыңыз" },
        { num: "3", text: "Экран жанғанша күтіңіз (30-60 секунд)" },
        { num: "4", text: "Өшіру үшін: Пуск → Өшіру батырмасын басыңыз" },
      ],
      warning: "⚠️ Компьютерді тікелей сымды суырып өшірмеңіз! Бұл файлдарды бүлдіруі мүмкін.",
    },
  },
  {
    id: "s5",
    module_id: "module-1-1",
    sort_order: 5,
    slide_type: "content",
    content: {
      title: "Жұмыс үстелі — сіздің цифрлық бөлмеңіз",
      emoji: "🏠",
      text: "Компьютер қосылған соң жұмыс үстелі пайда болады. Ол — сіздің бастапқы бетіңіз.",
      highlights: [
        { emoji: "📁", label: "Белгішелер", desc: "Бағдарламалар мен файлдарға жетелейді" },
        { emoji: "📋", label: "Тапсырмалар тақтасы", desc: "Экранның төменгі жолағы" },
        { emoji: "🔍", label: "Іздеу жолағы", desc: "Кез келген нәрсені тез табу үшін" },
        { emoji: "🕐", label: "Сағат пен күнтізбе", desc: "Оң жақ бұрышта орналасқан" },
      ],
      tip: "💡 Белгішені екі рет шертсеңіз — ол ашылады. Бір рет шертсеңіз — тек ерекшеленеді.",
    },
  },
  {
    id: "s6",
    module_id: "module-1-1",
    sort_order: 6,
    slide_type: "content",
    content: {
      title: "Тышқанмен жұмыс",
      emoji: "🖱️",
      text: "Тышқан — сіздің экрандағы қолыңыз. Оны меңгеру оңай!",
      highlights: [
        { emoji: "👆", label: "Бір рет шерту (сол жақ)", desc: "Затты таңдайды немесе батырманы басады" },
        { emoji: "👆👆", label: "Екі рет шерту", desc: "Файл немесе бағдарлама ашады" },
        { emoji: "👉", label: "Бір рет шерту (оң жақ)", desc: "Мәзір ашады — қосымша мүмкіндіктер" },
        { emoji: "⬆️⬇️", label: "Доңғалақ (scroll)", desc: "Беттің жоғары-төмен жылжытады" },
      ],
      tip: "💡 Тышқанды тегіс бетте жылжытыңыз. Курсор экранда сол бағытта қозғалады.",
    },
  },
  {
    id: "s7",
    module_id: "module-1-1",
    sort_order: 7,
    slide_type: "content",
    content: {
      title: "Пернетақтаның негізгі перне",
      emoji: "⌨️",
      text: "Пернетақтада жүздеген перне бар, бірақ алдымен негізгілерін білсек жетеді.",
      highlights: [
        { emoji: "↵", label: "Enter", desc: "Нәрсені растайды немесе жаңа жолға өтеді" },
        { emoji: "⌫", label: "Backspace", desc: "Курсордың сол жағындағы таңбаны өшіреді" },
        { emoji: "⎵", label: "Бос орын (пробел)", desc: "Сөздер арасына бос орын қояды" },
        { emoji: "⇧", label: "Shift", desc: "Бас әріп теру немесе белгі қою үшін" },
        { emoji: "Esc", label: "Escape", desc: "Іс-әрекетті тоқтатады немесе бетті жабады" },
      ],
      tip: "💡 Ctrl+C = Көшіру, Ctrl+V = Қою, Ctrl+Z = Артқа қайту — ең пайдалы комбинациялар!",
    },
  },
  {
    id: "s8",
    module_id: "module-1-1",
    sort_order: 8,
    slide_type: "interactive",
    content: {
      title: "Мен не жасай аламын?",
      prompt: "Қазір орындай алатыныңызды белгілеңіз:",
      items: [
        "Компьютерді қосып, өше аламын",
        "Тышқанды жылжытып, шерте аламын",
        "Жұмыс үстелін таниды, белгішелерді ашамын",
        "Enter, Backspace пернелерін пайдаланамын",
        "Ctrl+C, Ctrl+V комбинацияларын білемін",
      ],
    },
  },
  {
    id: "s9",
    module_id: "module-1-1",
    sort_order: 9,
    slide_type: "summary",
    content: {
      title: "Резюме: Бүгін не үйрендік",
      learned: [
        "Компьютердің бөліктері: монитор, пернетақта, тышқан, корпус",
        "Компьютерді дұрыс қосу және өшіру тәртібі",
        "Жұмыс үстелін пайдалану негіздері",
        "Тышқанмен жұмыс: бір рет, екі рет, оң жақ шерту",
        "Пернетақтаның негізгі пернелері мен комбинациялары",
      ],
      reflection: [
        "Сіз бұған дейін компьютерді қолдандыңыз ба?",
        "Қандай бөліктер сізге таныс болды?",
        "Қайсысын үйрену ең пайдалы болды деп ойлайсыз?",
      ],
      resource_label: "Microsoft: Компьютер негіздері (орысша)",
      resource_url: "https://support.microsoft.com/ru-ru",
    },
  },
];

// ── MODULE 1-1 QUIZ ───────────────────────────────────────────
export const MODULE_1_1_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    module_id: "module-1-1",
    sort_order: 1,
    question: "Компьютердің қай бөлігі ақпаратты экранда көрсетеді?",
    question_type: "single",
    options: ["Пернетақта", "Монитор", "Тышқан", "Корпус"],
    correct: [1],
    explanation: "Монитор — бұл компьютердің экраны. Ол барлық ақпаратты визуалды түрде көрсетеді.",
  },
  {
    id: "q2",
    module_id: "module-1-1",
    sort_order: 2,
    question: "Компьютерді қалай дұрыс өшіреміз?",
    question_type: "single",
    options: [
      "Тікелей розеткадан суырамыз",
      "Пуск → Өшіру батырмасын басамыз",
      "Тышқанды экранға тастаймыз",
      "Мониторды өшіреміз",
    ],
    correct: [1],
    explanation: "Дұрыс жол — Пуск мәзірі арқылы өшіру. Тікелей суыру файлдарды бүлдіруі мүмкін.",
  },
  {
    id: "q3",
    module_id: "module-1-1",
    sort_order: 3,
    question: "Тышқанның оң жақ батырмасын бассақ не болады?",
    question_type: "single",
    options: [
      "Файл ашылады",
      "Компьютер өшеді",
      "Қосымша мүмкіндіктер мәзірі ашылады",
      "Мәтін жойылады",
    ],
    correct: [2],
    explanation: "Оң жақ шерту — контекстік мәзірді ашады. Ол таңдалған затпен байланысты қосымша опцияларды береді.",
  },
  {
    id: "q4",
    module_id: "module-1-1",
    sort_order: 4,
    question: "Backspace пернесі не үшін қолданылады?",
    question_type: "single",
    options: [
      "Файл сақтау үшін",
      "Компьютерді өшіру үшін",
      "Курсордың сол жағындағы таңбаны өшіру үшін",
      "Жаңа бет ашу үшін",
    ],
    correct: [2],
    explanation: "Backspace — курсордың сол жағындағы таңбаны жояды. Delete керісінше, оң жақтағыны жояды.",
  },
  {
    id: "q5",
    module_id: "module-1-1",
    sort_order: 5,
    question: "Ctrl+C комбинациясы не істейді?",
    question_type: "single",
    options: ["Компьютерді қайта іске қосады", "Таңдалған мәтінді немесе файлды көшіреді", "Бәрін жояды", "Жаңа файл ашады"],
    correct: [1],
    explanation: "Ctrl+C — «Көшіру» командасы. Ctrl+V арқылы бастапқы орынды сақтай отырып, басқа жерге қоюға болады.",
  },
  {
    id: "q6",
    module_id: "module-1-1",
    sort_order: 6,
    question: "Жұмыс үстелінде белгішені ашу үшін не істейміз?",
    question_type: "single",
    options: [
      "Бір рет оң жаққа шертеміз",
      "Екі рет сол жаққа шертеміз",
      "Бір рет орталық батырмамен шертеміз",
      "Пернетақтадан атын теремін",
    ],
    correct: [1],
    explanation: "Файл немесе бағдарламаны ашу үшін екі рет тез шерту керек (double-click).",
  },
  {
    id: "q7",
    module_id: "module-1-1",
    sort_order: 7,
    question: "Ноутбук туралы дұрыс тұжырым қайсы?",
    question_type: "single",
    options: [
      "Ноутбукта тышқан болмайды",
      "Ноутбукта монитор, пернетақта және корпус бөлек",
      "Ноутбукта монитор, пернетақта және корпус бір тұтас",
      "Ноутбукты розеткаға жалғауға болмайды",
    ],
    correct: [2],
    explanation: "Ноутбук — портативті компьютер. Онда барлық бөліктер (экран, пернетақта, корпус) бір тұтасқа біріккен.",
  },
  {
    id: "q8",
    module_id: "module-1-1",
    sort_order: 8,
    question: "Тапсырмалар тақтасы (taskbar) қайда орналасқан?",
    question_type: "single",
    options: [
      "Экранның жоғарғы жағында",
      "Экранның сол жағында",
      "Экранның төменгі жолағында",
      "Экранның ортасында",
    ],
    correct: [2],
    explanation: "Windows-та тапсырмалар тақтасы (taskbar) — экранның ең төменгі жолағы. Онда Пуск батырмасы, ашық бағдарламалар және сағат орналасқан.",
  },
  {
    id: "q9",
    module_id: "module-1-1",
    sort_order: 9,
    question: "Қандай перне комбинациялары дұрыс? (Бірнешеуін таңдаңыз)",
    question_type: "multiple",
    options: [
      "Ctrl+C = Көшіру",
      "Ctrl+V = Қою",
      "Ctrl+Z = Артқа қайту",
      "Ctrl+X = Компьютерді өшіру",
    ],
    correct: [0, 1, 2],
    explanation: "Ctrl+C (көшіру), Ctrl+V (қою), Ctrl+Z (отменить/артқа) — ең пайдалы комбинациялар. Ctrl+X — бұл «қию» (вырезать), компьютерді өшірмейді.",
  },
  {
    id: "q10",
    module_id: "module-1-1",
    sort_order: 10,
    question: "Компьютер корпусы туралы дұрыс тұжырымдар қайсылар? (Барлық дұрысты таңдаңыз)",
    question_type: "multiple",
    options: [
      "Корпус — компьютердің «миы»",
      "Корпуста процессор мен жады орналасқан",
      "Корпус тек сыртқы безендіру үшін",
      "Корпустың алдыңғы жағында қосу батырмасы бар",
    ],
    correct: [0, 1, 3],
    explanation: "Корпус — компьютердің ең маңызды бөлігі. Онда процессор, жады (RAM), қатты диск орналасқан. Алдыңғы жағында Power батырмасы болады.",
  },
];

// ── Helper to get content by moduleId ────────────────────────
export function getSlidesForModule(moduleId: string): SlideContent[] {
  if (moduleId === "module-1-1") return MODULE_1_1_SLIDES;
  return [];
}

export function getQuizForModule(moduleId: string): QuizQuestion[] {
  if (moduleId === "module-1-1") return MODULE_1_1_QUIZ;
  return [];
}

export function getTrackById(id: string): TrackData | undefined {
  return STATIC_TRACKS.find((t) => t.id === id);
}

export function getModuleById(moduleId: string): ModuleData | undefined {
  for (const track of STATIC_TRACKS) {
    const m = track.modules.find((m) => m.id === moduleId);
    if (m) return m;
  }
  return undefined;
}

export function getModuleTrack(moduleId: string): TrackData | undefined {
  return STATIC_TRACKS.find((t) => t.modules.some((m) => m.id === moduleId));
}
