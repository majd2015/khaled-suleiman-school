// محتوى مؤقت للتجربة. يُستبدل بمحتوى المدرسة الحقيقي.

export type NewsCategory = "احتفالات" | "رحلات" | "مجتمع" | "تعليم";

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: NewsCategory;
  excerpt: string;
  body: string[];
  image?: string;
  grades?: number[];
  source?: "site" | "facebook";
  sourceUrl?: string;
};

export const news: NewsItem[] = [
  {
    slug: "opening-2026",
    title: "افتتاح السنة الدراسية 2026/2027",
    date: "2026-09-01",
    category: "احتفالات",
    excerpt: "استقبلت المدرسة طلابها في أول يوم دراسي بفعاليات ترحيبية للصف السابع.",
    body: [
      "هذا خبر تجريبي. سيظهر هنا نص الخبر الكامل كما تكتبه إدارة المدرسة.",
      "عند نشر الخبر من لوحة الإدارة يمكن نشره تلقائيًا على صفحة المدرسة في فيسبوك وإنستجرام.",
    ],
    grades: [7],
  },
  {
    slug: "science-trip",
    title: "رحلة علمية للصف الثامن",
    date: "2026-09-18",
    category: "رحلات",
    excerpt: "زار طلاب الصف الثامن متحف العلوم ضمن برنامج STEM.",
    body: ["خبر تجريبي عن رحلة علمية. يُستبدل بخبر حقيقي."],
    grades: [8],
  },
  {
    slug: "community-day",
    title: "يوم التطوع في البلدة",
    date: "2026-10-02",
    category: "مجتمع",
    excerpt: "شارك طلاب الصف التاسع في حملة تنظيف وتشجير قرب المدرسة.",
    body: ["خبر تجريبي عن يوم تطوعي. يُستبدل بخبر حقيقي."],
    grades: [9],
  },
  {
    slug: "reading-week",
    title: "أسبوع القراءة",
    date: "2026-10-09",
    category: "تعليم",
    excerpt: "انطلق أسبوع القراءة بمسابقات بين الشعب ورفوف كتب في الصفوف.",
    body: ["خبر تجريبي عن أسبوع القراءة. يُستبدل بخبر حقيقي."],
  },
];

export type Announcement = {
  id: string;
  title: string;
  date: string;
  text: string;
  urgent?: boolean;
  grades?: number[];
};

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "اجتماع أولياء الأمور",
    date: "2026-10-20",
    text: "يُعقد اجتماع أولياء أمور الصف السابع الساعة 17:00 في قاعة المدرسة (إعلان تجريبي).",
    grades: [7],
  },
  {
    id: "a2",
    title: "تغيير موعد امتحان الرياضيات",
    date: "2026-10-16",
    text: "تأجّل امتحان الرياضيات للصف التاسع إلى يوم الأحد (إعلان تجريبي).",
    urgent: true,
    grades: [9],
  },
  {
    id: "a3",
    title: "عطلة رسمية",
    date: "2026-10-25",
    text: "لا دوام يوم الأحد بسبب العطلة الرسمية (إعلان تجريبي).",
  },
];

export type Section = { name: string; teacher: string };
export type Grade = {
  id: number;
  name: string;
  motto: string;
  color: string;
  intro: string;
  expectations: string[];
  sections: Section[];
};

export const grades: Grade[] = [
  {
    id: 7,
    name: "الصف السابع",
    motto: "أكتشف وأتعرّف",
    color: "var(--g7)",
    intro: "سنة الانتقال إلى المدرسة الإعدادية: التعرّف على المدرسة وبناء عادات تعلّم جديدة.",
    expectations: ["أتعرّف على مدرستي وزملائي", "أنظّم وقتي وحقيبتي", "أطرح الأسئلة وأشارك"],
    sections: [
      { name: "سابع 1", teacher: "اسم المربي" },
      { name: "سابع 2", teacher: "اسم المربي" },
      { name: "سابع 3", teacher: "اسم المربي" },
    ],
  },
  {
    id: 8,
    name: "الصف الثامن",
    motto: "أجرّب وأتعمّق",
    color: "var(--g8)",
    intro: "سنة التجربة والتعمّق في المواد والمشاريع.",
    expectations: ["أعمل ضمن فريق", "أنفّذ مشروعًا بحثيًا", "أتحمّل مسؤولية تعلّمي"],
    sections: [
      { name: "ثامن 1", teacher: "اسم المربي" },
      { name: "ثامن 2", teacher: "اسم المربي" },
      { name: "ثامن 3", teacher: "اسم المربي" },
    ],
  },
  {
    id: 9,
    name: "الصف التاسع",
    motto: "أختار وأنطلق",
    color: "var(--g9)",
    intro: "سنة الاستعداد للمرحلة الثانوية واختيار المسار.",
    expectations: ["أتعرّف على المسارات الثانوية", "أقود مبادرة في المدرسة", "أستعد للامتحانات"],
    sections: [
      { name: "تاسع 1", teacher: "اسم المربي" },
      { name: "تاسع 2", teacher: "اسم المربي" },
      { name: "تاسع 3", teacher: "اسم المربي" },
    ],
  },
];

export type EventType = "امتحان" | "نشاط" | "عطلة" | "عام";
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  confirmed: boolean;
  grades?: number[];
};

export const events: CalendarEvent[] = [
  { id: "e1", title: "امتحان رياضيات", date: "2026-10-18", type: "امتحان", confirmed: true, grades: [9] },
  { id: "e2", title: "اجتماع أولياء الأمور", date: "2026-10-20", type: "عام", confirmed: true, grades: [7] },
  { id: "e3", title: "عطلة رسمية", date: "2026-10-25", type: "عطلة", confirmed: true },
  { id: "e4", title: "معرض العلوم", date: "2026-11-05", type: "نشاط", confirmed: false },
  { id: "e5", title: "امتحان لغة عربية", date: "2026-11-10", type: "امتحان", confirmed: false, grades: [8] },
  { id: "e6", title: "رحلة الصف السابع", date: "2026-11-19", type: "نشاط", confirmed: false, grades: [7] },
];

export type Challenge = {
  slug: string;
  title: string;
  subject: string;
  level: "سهل" | "متوسط" | "صعب";
  minutes: number;
  grades: number[];
  question: string;
  hints: string[];
  answer: string;
};

export const challenges: Challenge[] = [
  {
    slug: "number-pattern",
    title: "النمط العددي",
    subject: "رياضيات",
    level: "سهل",
    minutes: 5,
    grades: [7, 8],
    question: "ما العدد التالي في النمط: 2، 6، 12، 20، 30، ...؟",
    hints: ["انظر إلى الفرق بين كل عددين متتاليين.", "الفروق هي 4، 6، 8، 10..."],
    answer: "42",
  },
  {
    slug: "plant-light",
    title: "النبتة والضوء",
    subject: "علوم",
    level: "متوسط",
    minutes: 10,
    grades: [8, 9],
    question: "لماذا تميل النبتة الموضوعة قرب النافذة نحو الضوء؟",
    hints: ["فكّر في هرمونات النمو.", "الخلايا في الجهة المظلمة تستطيل أكثر."],
    answer: "بسبب هرمون الأوكسين الذي يتجمّع في الجهة المظلمة فيجعل خلاياها تستطيل أكثر.",
  },
  {
    slug: "english-word",
    title: "Hidden Word",
    subject: "إنجليزي",
    level: "سهل",
    minutes: 3,
    grades: [7, 8, 9],
    question: "Which word can go before: ball, print, step? (Hint: it's part of your body)",
    hints: ["It's at the end of your leg."],
    answer: "foot",
  },
];

export type Newsletter = {
  slug: string;
  title: string;
  month: string;
  stories: { title: string; text: string }[];
  homeQuestion: string;
};

export const newsletters: Newsletter[] = [
  {
    slug: "2026-09",
    title: "نشرة أيلول",
    month: "أيلول 2026",
    stories: [
      { title: "من الصف السابع", text: "أسبوع التعرّف على المدرسة (نص تجريبي)." },
      { title: "من الصف الثامن", text: "انطلاق مشاريع STEM (نص تجريبي)." },
      { title: "من الصف التاسع", text: "لقاء حول المسارات الثانوية (نص تجريبي)." },
    ],
    homeQuestion: "ما الشيء الذي تعلّمته هذا الشهر وتريد أن تعلّمه لأحد في البيت؟",
  },
];

export const didYouKnow = [
  "قلب الإنسان ينبض نحو 100 ألف مرة في اليوم.",
  "العسل لا يفسد إذا حُفظ جيدًا.",
  "الضوء يقطع المسافة من الشمس إلى الأرض في نحو 8 دقائق.",
];
