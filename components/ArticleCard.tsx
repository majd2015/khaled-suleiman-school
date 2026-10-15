import Link from "next/link";
import { srcSet, type Article } from "@/content/articles";

export default function ArticleCard({ a }: { a: Article }) {
  const href = `/articles/${a.slug}`;
  return (
    <article className="card article-card">
      <Link href={href} className="cover" tabIndex={-1} aria-hidden="true">
        <img src={a.cover.srcSet[1]?.src ?? a.cover.src} srcSet={srcSet(a)} sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px" width={a.cover.width} height={a.cover.height} alt="" loading="lazy" />
      </Link>
      <div className="body">
        <div className="tags">
          <span className="badge">{a.categoryLabel}</span>
          <span className="badge outline">{a.readingMinutes} دقائق قراءة</span>
        </div>
        <h3><Link href={href}>{a.title}</Link></h3>
        <p>{a.excerpt}</p>
      </div>
      <div className="foot"><p>«{a.deck}»</p></div>
    </article>
  );
}
