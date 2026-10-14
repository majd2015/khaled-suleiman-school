import { news as localNews, type NewsItem } from "@/content/data";
import { fetchFacebookPosts } from "@/lib/social";

// كل الأخبار: أخبار الموقع + منشورات فيسبوك (تتحدّث كل 15 دقيقة).
export async function getAllNews(): Promise<NewsItem[]> {
  const fb = await fetchFacebookPosts();
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
  return [...localNews, ...imported].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsItem(slug: string) {
  return (await getAllNews()).find((n) => n.slug === slug);
}
