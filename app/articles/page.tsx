import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { PageHead } from "@/components/ui";
import { articleCategories, articles } from "@/content/articles";

export const metadata = { title: "مجلة المدرسة" };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const list = c ? articles.filter((a) => a.category === c) : articles;
  return (
    <>
      <PageHead title="مجلة المدرسة" subtitle="مقالات قصيرة في العلوم والتكنولوجيا وحياة المدرسة، مع نشاط وسؤال في آخر كل مقال." />
      <section className="section">
        <div className="container">
          <nav className="filters" aria-label="المجالات">
            <Link href="/articles" className={!c ? "active" : ""}>الكل ({articles.length})</Link>
            {articleCategories.map(([id, label]) => (
              <Link key={id} href={`/articles?c=${id}`} className={c === id ? "active" : ""}>{label}</Link>
            ))}
          </nav>
          <div className="grid articles">
            {list.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        </div>
      </section>
    </>
  );
}
