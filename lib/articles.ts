import data from "@/content/articles.json";
export type Article = (typeof data)[number];
export type ArticleSummary = Pick<
  Article,
  | "slug"
  | "title"
  | "category"
  | "categoryLabel"
  | "theme"
  | "excerpt"
  | "readingMinutes"
  | "cover"
>;
export const articles = data;
export const articleSummaries: ArticleSummary[] = articles.map(
  ({
    slug,
    title,
    category,
    categoryLabel,
    theme,
    excerpt,
    readingMinutes,
    cover,
  }) => ({
    slug,
    title,
    category,
    categoryLabel,
    theme,
    excerpt,
    readingMinutes,
    cover,
  }),
);
export const categories = Array.from(
  new Map(articles.map((a) => [a.category, a.categoryLabel])),
).map(([id, label]) => ({ id, label }));
