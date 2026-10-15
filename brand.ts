// المكان الوحيد لتعديل ألوان الموقع. كل الصفحات تقرأ الألوان من هنا عبر متغيرات CSS (var(--اسم)).
// القيم الحالية مقترحة من خطة الهوية البصرية (brand-tokens.json)، وتُراجع عند وصول الشعار الرسمي.

export const colors = {
  // تجربة تصميم جيميني (النسخة الأصلية الدافئة): حبر كحلي، حدود سميكة وظلال صلبة، برتقالي وأصفر ونعناعي.
  light: {
    primary: "#0d5c9e", // الروابط
    "primary-dark": "#0f2032", // الحبر: الحدود والظلال والعناوين والتذييل
    accent: "#e58529", // البرتقالي: الأزرار الرئيسية
    "on-accent": "#ffffff",
    yellow: "#f5d142", // الملصقات وشارات الوقت
    brush: "#f7d348", // خط الفرشاة تحت الكلمات
    "mint-card": "#a6e3d0", // بطاقة المبادرات
    green: "#2a6f44",
    "word-1": "#0f355c", // ألوان العنوان الكبير الثلاثة
    "word-2": "#0e6ba8",
    "word-3": "#1e824c",
    bg: "#f9f6ee", // خلفية الصفحة العاجية
    "bg-alt": "#efece1", // خلفية الأقسام البديلة
    mint: "#eef2f5", // خلفيات الوسوم والأيقونات
    surface: "#ffffff",
    text: "#0f2032",
    body: "#33475b",
    muted: "#5c7080",
    border: "#0f2032",
    "on-dark": "#dfe6ee",
    g7: "#0e6ba8", // الصف السابع
    g8: "#1e824c", // الصف الثامن
    g9: "#e58529", // الصف التاسع
    danger: "#c2361b",
    "danger-bg": "#fde8e4",
    "danger-border": "#c2361b",
    success: "#1e824c",
    holiday: "#6a4c93",
    "pending-bg": "#fff4cc",
    "pending-text": "#6b4e00",
  },
  // التصميم التجريبي فاتح فقط حاليًا؛ ما يُكتب هنا يُطبَّق في الوضع الليلي.
  dark: {},
} as const;

export const themeColor = colors.light["primary-dark"];

const vars = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `--${k}:${v};`)
    .join("");

export const brandCss =
  `:root{${vars(colors.light)}}` +
  (Object.keys(colors.dark).length ? `@media (prefers-color-scheme: dark){:root{${vars(colors.dark)}}}` : "");
