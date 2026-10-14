import Link from "next/link";
import type { NewsCategory } from "@/content/data";
import { getAllNews } from "@/lib/news";
import { NewsCard, PageHead } from "@/components/ui";

export const metadata = { title: "الأخبار" };

const PER_PAGE = 9;
const categories: NewsCategory[] = ["احتفالات", "رحلات", "مجتمع", "تعليم"];

export default async function News({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const { cat, page } = await searchParams;
  const filtered = (await getAllNews())
    .filter((n) => !cat || n.category === cat);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(pages, Math.max(1, Number(page) || 1));
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const q = (p: Record<string, string | undefined>) =>
    "?" + new URLSearchParams(Object.entries(p).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <PageHead title="الأخبار" subtitle="ما يحدث في مدرستنا" />
      <section className="section">
        <div className="container">
          <nav className="filters">
            <Link href="/news" className={!cat ? "active" : ""}>الكل</Link>
            {categories.map((c) => (
              <Link key={c} href={`/news${q({ cat: c })}`} className={cat === c ? "active" : ""}>{c}</Link>
            ))}
          </nav>
          <div className="grid">
            {shown.map((n) => <NewsCard key={n.slug} item={n} />)}
          </div>
          {pages > 1 && (
            <nav className="filters" style={{ marginTop: 24 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/news${q({ cat, page: String(p) })}`} className={p === current ? "active" : ""}>{p}</Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
