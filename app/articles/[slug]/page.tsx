import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, Lightbulb, BookOpen, Check } from "lucide-react";
import { articles } from "@/lib/articles";
import { articleImage } from "@/lib/article-utils";
import ArticleCard from "@/components/articles/ArticleCard";
import ReaderControls from "@/components/articles/ReaderControls";
import ArticleQuiz from "@/components/articles/ArticleQuiz";
import ArticleDiagram from "@/components/articles/ArticleDiagram";
import "../articles.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  // صورة المشاركة: الغلاف بعرض 1600 (نسبة 16:9)
  const image = a.cover.srcSet.find((s) => s.width === 1600)?.src ?? a.cover.src;
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: [{ url: articleImage(image), width: 1600, height: 900, alt: a.cover.alt }] },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const related = a.related
    .map((s) => articles.find((x) => x.slug === s))
    .filter((x) => x !== undefined);
  return (
    <div className="magazine">
      <article className="article-reader container">
        <Link className="text-link back-link" href="/articles">
          <ArrowRight size={17} /> إلى مجلة آفاق
        </Link>
        <header className="reader-heading">
          <div className="meta">
            <Link className="badge" href={"/articles?category=" + a.category}>
              {a.categoryLabel}
            </Link>
            <span className="read-time">
              <Clock3 size={14} />
              {a.readingMinutes} د قراءة
            </span>
            <span>للصفوف السابع–التاسع</span>
          </div>
          <h1>{a.title}</h1>
          <p className="reader-deck">{a.deck}</p>
          <p className="article-attribution">{a.attribution}</p>
        </header>
        <figure className="reader-cover">
          <img
            src={articleImage(a.cover.src)}
            srcSet={a.cover.srcSet
              .map((s) => articleImage(s.src) + " " + s.width + "w")
              .join(", ")}
            sizes="(max-width:900px) 100vw, 1080px"
            alt={a.cover.alt}
            width={1600}
            height={900}
            fetchPriority="high"
          />
          <figcaption>{a.cover.caption}</figcaption>
        </figure>
        <div className="reader-layout">
          <aside className="reader-toc">
            <h2>في هذا المقال</h2>
            <nav aria-label="محتويات المقال">
              {a.sections.map((s, i) => (
                <a key={s.heading} href={"#section-" + i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </a>
              ))}
              <a href="#activity">
                <Lightbulb size={15} /> جرّب بنفسك
              </a>
              <a href="#sources">
                <BookOpen size={15} /> المصادر
              </a>
            </nav>
          </aside>
          <ReaderControls slug={a.slug} title={a.title}>
            <div className="learning-goal">
              <Lightbulb size={23} />
              <div>
                <strong>ما الذي ستكتشفه؟</strong>
                <p>{a.learningGoal}</p>
              </div>
            </div>
            {a.sections.map((s, i) => (
              <section
                className="reader-section"
                id={"section-" + i}
                key={s.heading}
              >
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {"sourceIds" in s && s.sourceIds && (
                  <p className="inline-sources">
                    للاطّلاع:{" "}
                    {s.sourceIds.map((id) => {
                      const source = a.sources.find(
                        (source) => source.id === id,
                      );
                      return source ? (
                        <a
                          href={source.url}
                          key={id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title} ↗{" "}
                        </a>
                      ) : null;
                    })}
                  </p>
                )}
              </section>
            ))}
            {a.diagram && <ArticleDiagram diagram={a.diagram} />}
            <section className="reader-activity" id="activity">
              <span className="eyebrow">
                <Lightbulb size={17} /> جرّب بنفسك / نحو {a.activity.minutes}{" "}
                دقيقة
              </span>
              <h2>{a.activity.title}</h2>
              <ol>
                {a.activity.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>
            <section className="reader-takeaways">
              <h2>ثلاث أفكار تأخذها معك</h2>
              <ul>
                {a.takeaways.map((t) => (
                  <li key={t}>
                    <Check size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
            <ArticleQuiz question={a.question} />
            <div className="reader-activity">
              <h2>حوّل القراءة إلى تجربة.</h2>
              <p>اختبر فهمك، واكتب تطبيقًا للفكرة، وأضفها إلى جواز تعلّمك.</p>
              <Link
                className="btn"
                href={`/play/article-quest?article=${a.slug}`}
              >
                ابدأ تحدّي هذا المقال ←
              </Link>
            </div>
            <section className="reader-sources" id="sources">
              <h2>المصادر ومسار القراءة</h2>
              <ul>
                {a.sources.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </ReaderControls>
        </div>
        <section className="related-articles">
          <div className="section-title">
            <div>
              <span className="eyebrow">الفكرة تقود إلى فكرة</span>
              <h2>واصل الاكتشاف.</h2>
            </div>
            <Link className="text-link" href="/articles">
              كل المقالات ←
            </Link>
          </div>
          <div className="article-grid">
            {related.map((r) => (
              <ArticleCard article={r} key={r.slug} />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
