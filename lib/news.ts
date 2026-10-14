import * as demo from "@/content/data";
import type { Announcement, CalendarEvent, EventType, NewsCategory, NewsItem } from "@/content/data";
import { fetchFacebookPosts } from "@/lib/social";
import { isDbConfigured, supabasePublic } from "@/lib/supabase/server";

// مصدر المحتوى: قاعدة البيانات إذا كانت مربوطة، وإلا المحتوى التجريبي في content/data.ts.

type NewsRow = {
  slug: string; title: string; excerpt: string; body: string; category: NewsCategory;
  grades: number[]; image_url: string | null; published_at: string;
};

const paragraphs = (text: string) => text.split(/\n+/).map((p) => p.trim()).filter(Boolean);

async function siteNews(): Promise<NewsItem[]> {
  if (!isDbConfigured()) return demo.news;
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("news")
    .select("slug,title,excerpt,body,category,grades,image_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(200);
  return ((data ?? []) as NewsRow[]).map((r) => ({
    slug: r.slug,
    title: r.title,
    date: r.published_at,
    category: r.category,
    excerpt: r.excerpt || paragraphs(r.body)[0]?.slice(0, 160) || "",
    body: paragraphs(r.body),
    image: r.image_url ?? undefined,
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
  const supabase = supabasePublic();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("announcements")
    .select("id,title,body,urgent,grades,date,expires_on")
    .or(`expires_on.is.null,expires_on.gte.${today}`)
    .order("date", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    text: r.body,
    urgent: r.urgent,
    grades: r.grades?.length ? r.grades : undefined,
  }));
}

export async function getEvents(): Promise<CalendarEvent[]> {
  if (!isDbConfigured()) return demo.events;
  const supabase = supabasePublic();
  const { data } = await supabase.from("events").select("id,title,date,type,confirmed,grades").order("date");
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    type: r.type as EventType,
    confirmed: r.confirmed,
    grades: r.grades?.length ? r.grades : undefined,
  }));
}
