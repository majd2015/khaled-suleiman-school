import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpLeft, Clock3, Sparkles } from "lucide-react";
import { articles, articleSummaries, categories } from "@/lib/articles";
import { articleImage } from "@/lib/article-utils";
import ArticleLibrary from "@/components/articles/ArticleLibrary";
import "./articles.css";
export const metadata = {
  title: "مجلة آفاق",
  description:
    "علوم ورياضة وتربية وقيم. مقالات تفتح فضول طلاب مدرسة خالد سليمان.",
};
export default function ArticlesPage() {
  const featured = articles[0];
  return (
    <div className="magazine">
      <section className="magazine-intro container">
        <div className="magazine-heading">
          <div>
            <span className="eyebrow">
              <Sparkles size={16} /> مجلة مدرسة خالد سليمان
            </span>
            <h1>
              آفاق<span className="title-dot">.</span>
            </h1>
          </div>
          <p>
            مساحة لأسئلتك الكبيرة،
            <br />
            وللاكتشافات الصغيرة التي تغيّر نظرتك.
          </p>
        </div>
        <Link className="featured-article" href={"/articles/" + featured.slug}>
          <div className="featured-image">
            <img
              src={articleImage(featured.cover.src)}
              srcSet={featured.cover.srcSet
                .map((s) => articleImage(s.src) + " " + s.width + "w")
                .join(", ")}
              sizes="(max-width:700px) 100vw, 700px"
              width={1600}
              height={900}
              alt={featured.cover.alt}
              fetchPriority="high"
            />
          </div>
          <div className="featured-copy">
            <span className="eyebrow">اختيار آفاق / علوم في الملعب</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className="read-time">
              <Clock3 size={14} />
              {featured.readingMinutes} د قراءة
            </span>
            <span className="btn ghost">
              وراء الركلة، حكاية <ArrowUpLeft size={18} />
            </span>
          </div>
        </Link>
      </section>
      <section className="container library-section">
        <Suspense fallback={<p>تُحمّل المقالات…</p>}>
          <ArticleLibrary articles={articleSummaries} categories={categories} />
        </Suspense>
      </section>
    </div>
  );
}
