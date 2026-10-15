// مجلة المدرسة: 18 مقالًا من حزمة المقالات V3 (content/articles.json كما وصلت).
// النصوص أُعدّت بمساعدة الذكاء الاصطناعي وحالتها "جاهزة للمراجعة"، لا منشورة رسميًا من إدارة المدرسة.
import raw from "./articles.json";

export type Article = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  grades: number[];
  excerpt: string;
  deck: string;
  learningGoal: string;
  sections: { heading: string; paragraphs: string[]; sourceIds?: string[] }[];
  activity: { title: string; minutes: number; steps: string[] };
  takeaways: string[];
  question: { text: string; options: string[]; correctIndex: number; explanation: string };
  sources: { id: string; title: string; url: string }[];
  related: string[];
  diagram: { id: string; caption: string; alt: string; src: string } | null;
  attribution: string;
  type: string;
  readingMinutes: number;
  cover: { src: string; alt: string; width: number; height: number; srcSet: { src: string; width: number }[] };
};

// مسارات الحزمة نسبية (images/..., diagrams/...)؛ الملفات منسوخة إلى public/assets/articles.
const asset = (p: string) => "/assets/articles/" + p.split("/").pop();

export const articles: Article[] = (raw as unknown as Article[]).map((a) => ({
  ...a,
  cover: { ...a.cover, src: asset(a.cover.src), srcSet: a.cover.srcSet.map((s) => ({ ...s, src: asset(s.src) })) },
  diagram: a.diagram ? { ...a.diagram, src: asset(a.diagram.src) } : null,
}));

export const articleCategories = [...new Map(articles.map((a) => [a.category, a.categoryLabel])).entries()];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const srcSet = (a: Article) => a.cover.srcSet.map((s) => `${s.src} ${s.width}w`).join(", ");
