export function articleImage(path: string) {
  return "/assets/articles/" + path.split("/").pop();
}
export function normalizeArabic(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي");
}
export function searchArticles<
  T extends {
    title: string;
    excerpt: string;
    category: string;
    categoryLabel: string;
  },
>(list: T[], query: string, category = "all"): T[] {
  const words = normalizeArabic(query).trim().split(/\s+/).filter(Boolean);
  return list.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      words.every((w) =>
        normalizeArabic(
          a.title + " " + a.excerpt + " " + a.categoryLabel,
        ).includes(w),
      ),
  );
}
