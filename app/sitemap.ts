import type { MetadataRoute } from "next";
import { siteUrl } from "@/site.config";
import { articles } from "@/lib/articles";
import { challenges, grades, newsletters, news } from "@/content/data";

const pages = [
  "/", "/articles", "/discover", "/grades", "/news", "/announcements", "/calendar", "/newsletter",
  "/challenges", "/participate", "/participate/debate", "/participate/vote", "/participate/kind-word",
  "/participate/reading", "/school", "/school/principal", "/school/vision", "/school/constitution",
  "/school/staff", "/school/contact", "/privacy", "/app",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // لا خريطة قبل تحديد عنوان الموقع النهائي (SITE_URL).
  if (!siteUrl) return [];
  const paths = [
    ...pages,
    ...grades.map((g) => `/grades/${g.id}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...challenges.map((c) => `/challenges/${c.slug}`),
    ...newsletters.map((n) => `/newsletter/${n.slug}`),
    // الأخبار التجريبية لا تدخل خريطة الموقع
    ...news.filter((n) => !n.sample).map((n) => `/news/${n.slug}`),
  ];
  return paths.map((p) => ({ url: siteUrl + p }));
}
