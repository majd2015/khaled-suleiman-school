// المكان الوحيد لتعديل ألوان الموقع. كل الصفحات تقرأ الألوان من هنا عبر متغيرات CSS (var(--اسم)).
// القيم الحالية مقترحة من خطة الهوية البصرية (brand-tokens.json)، وتُراجع عند وصول الشعار الرسمي.

export const colors = {
  light: {
    primary: "#2d6a4f", // الأزرار والروابط
    "primary-dark": "#173e35", // الشريط العلوي والتذييل والعناوين
    accent: "#e2b54a", // الذهبي: التفاصيل والأزرار الرئيسية
    "on-accent": "#1f2a24", // لون الكتابة فوق الذهبي
    bg: "#f7f4eb", // خلفية الصفحة (عاجي)
    mint: "#e2eee7", // خلفيات البطاقات والأيقونات والرسوم المؤقتة
    surface: "#ffffff",
    text: "#23362e",
    muted: "#57675e",
    border: "#e3e0d4",
    "on-dark": "#dfe9e4", // الكتابة فوق الأخضر الغامق
    g7: "#4e7f99", // الصف السابع
    g8: "#2d6a4f", // الصف الثامن
    g9: "#c67350", // الصف التاسع
    danger: "#b3361b",
    "danger-bg": "#fde8e4",
    "danger-border": "#f4b7a9",
    success: "#2a7d3c",
    holiday: "#6a4c93",
    "pending-bg": "#fff7e0",
    "pending-text": "#7a5a00",
  },
  // الوضع الليلي: ما لم يُذكر هنا يبقى كما في light
  dark: {
    primary: "#6fbf98",
    "primary-dark": "#10261f",
    bg: "#0f1613",
    mint: "#1b2a24",
    surface: "#16201c",
    text: "#e6eee9",
    muted: "#9db0a5",
    border: "#2a3832",
  },
} as const;

export const themeColor = colors.light["primary-dark"];

const vars = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `--${k}:${v};`)
    .join("");

export const brandCss =
  `:root{${vars(colors.light)}}` +
  `@media (prefers-color-scheme: dark){:root{${vars(colors.dark)}--shadow:none;}}`;
