import Link from "next/link";
import { Clock3, ArrowLeft } from "lucide-react";
import type { ArticleSummary } from "@/lib/articles";
import { articleImage } from "@/lib/article-utils";
import BookmarkButton from "./BookmarkButton";
export default function ArticleCard({
  article: a,
}: {
  article: ArticleSummary;
}) {
  return (
    <article className={"article-card tone-" + a.theme}>
      <Link
        className="article-cover"
        href={"/articles/" + a.slug}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={articleImage(a.cover.srcSet[1].src)}
          srcSet={a.cover.srcSet
            .map((s) => articleImage(s.src) + " " + s.width + "w")
            .join(", ")}
          sizes="(max-width:620px) 100vw, (max-width:960px) 50vw, 380px"
          width={1600}
          height={900}
          loading="lazy"
          alt=""
        />
      </Link>
      <div className="article-card-body">
        <div className="meta">
          <span className="category-tag">{a.categoryLabel}</span>
          <span className="read-time">
            <Clock3 size={13} />
            {a.readingMinutes} د قراءة
          </span>
        </div>
        <h3>
          <Link href={"/articles/" + a.slug}>{a.title}</Link>
        </h3>
        <p>{a.excerpt}</p>
        <div className="article-card-footer">
          <Link
            className="text-link"
            href={"/articles/" + a.slug}
            aria-label={"اقرأ المقال: " + a.title}
          >
            اقرأ واكتشف <ArrowLeft size={17} />
          </Link>
          <BookmarkButton slug={a.slug} title={a.title} />
        </div>
      </div>
    </article>
  );
}
