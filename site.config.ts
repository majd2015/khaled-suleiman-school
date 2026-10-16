// هوية المدرسة. كل قيمة فيها "PENDING" بانتظار بيانات المديرة.
export const PENDING = "بانتظار بيانات المدرسة";

export const site = {
  name: "مدرسة خالد سليمان الإعدادية",
  shortName: "خالد سليمان",
  domainName: "PENDING", // اسم الموقع الذي ستختاره المديرة
  tagline: "نتعلّم • نشارك • ننطلق",
  yearTheme: { year: "2026/2027", title: "موضوع السنة", text: PENDING },
  grades: "الصفوف السابع حتى التاسع",
  principal: { name: PENDING, title: "مديرة المدرسة", photo: "" },
  contact: {
    address: PENDING,
    phone: PENDING,
    fax: PENDING,
    email: PENDING,
    hours: PENDING,
    mapUrl: "",
  },
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
} as const;

export const nav = [
  { href: "/", label: "الرئيسية" },
  {
    href: "/school",
    label: "عن المدرسة",
    children: [
      { href: "/school", label: "نبذة" },
      { href: "/school/principal", label: "كلمة المديرة" },
      { href: "/school/vision", label: "الرؤية والرسالة" },
      { href: "/school/constitution", label: "دستور المدرسة" },
      { href: "/school/staff", label: "الطاقم" },
      { href: "/school/contact", label: "اتصل بنا" },
    ],
  },
  {
    href: "/grades",
    label: "الصفوف",
    children: [
      { href: "/grades/7", label: "الصف السابع" },
      { href: "/grades/8", label: "الصف الثامن" },
      { href: "/grades/9", label: "الصف التاسع" },
    ],
  },
  { href: "/news", label: "الأخبار" },
  { href: "/announcements", label: "الإعلانات" },
  { href: "/calendar", label: "الرزنامة" },
  {
    href: "/participate",
    label: "شارك",
    children: [
      { href: "/challenges", label: "تحدَّ نفسك" },
      { href: "/participate/debate", label: "منبر المناظرة" },
      { href: "/participate/vote", label: "التصويت" },
      { href: "/participate/kind-word", label: "الكلمة الطيبة صدقة" },
      { href: "/participate/reading", label: "نادي القراءة" },
      { href: "/newsletter", label: "النشرة الشهرية" },
    ],
  },
] as const;
