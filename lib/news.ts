import * as demo from "@/content/data";
import type { Announcement, CalendarEvent, EventType, NewsCategory, NewsItem } from "@/content/data";
import { fetchFacebookPosts } from "@/lib/social";
import { db, isDbConfigured } from "@/lib/prisma";

const iso = (d: Date) => d.toISOString().slice(0, 10);

// مصدر المحتوى: قاعدة البيانات إذا كانت مربوطة، وإلا المحتوى التجريبي في content/data.ts.

const paragraphs = (text: string) => text.split(/\n+/).map((p) => p.trim()).filter(Boolean);

async function siteNews(): Promise<NewsItem[]> {
  if (!isDbConfigured()) return demo.news;
  const rows = await db().news.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    date: iso(r.publishedAt),
    category: r.category as NewsCategory,
    excerpt: r.excerpt || paragraphs(r.body)[0]?.slice(0, 160) || "",
    body: paragraphs(r.body),
    image: r.imageUrl ?? undefined,
    grades: r.grades.length ? r.grades : undefined,
    source: "site",
  }));
}

// كل الأخبار: أخبار الموقع + منشورات فيسبوك (تتحدّث كل 15 دقيقة).
export async function getAllNews(): Promise<NewsItem[]> {
  const [local, fb] = await Promise.all([siteNews(), fetchFacebookPosts()]);
  const imported: NewsItem[] = fb.map((p) => {
    const [first, ...rest] = p.message.split("\n").filter(Boolean);
    return {
      slug: `fb-${p.id}`,
      title: first.length > 90 ? first.slice(0, 90) + "…" : first,
      date: p.date,
      category: "مجتمع",
      excerpt: (rest.join(" ") || first).slice(0, 160),
      body: p.message.split("\n").filter(Boolean),
      image: p.image,
      source: "facebook",
      sourceUrl: p.permalink,
    };
  });
  return [...local, ...imported].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsItem(slug: string) {
  return (await getAllNews()).find((n) => n.slug === decodeURIComponent(slug));
}

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!isDbConfigured()) return demo.announcements;
  const today = new Date(new Date().toISOString().slice(0, 10));
  const rows = await db().announcement.findMany({
    where: { OR: [{ expiresOn: null }, { expiresOn: { gte: today } }] },
    orderBy: { date: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    date: iso(r.date),
    text: r.body,
    urgent: r.urgent,
    grades: r.grades.length ? r.grades : undefined,
  }));
}

export async function getEvents(): Promise<CalendarEvent[]> {
  if (!isDbConfigured()) return demo.events;
  const rows = await db().event.findMany({ orderBy: { date: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    date: iso(r.date),
    type: r.type as EventType,
    confirmed: r.confirmed,
    grades: r.grades.length ? r.grades : undefined,
  }));
}
