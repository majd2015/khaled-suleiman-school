import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Quiz from "@/components/Quiz";
import { articles, getArticle, srcSet } from "@/content/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const sourceNo = (id: string) => a.sources.findIndex((s) => s.id === id) + 1;

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="tags">
            <Link href={`/articles?c=${a.category}`} className="badge yellow">{a.categoryLabel}</Link>
            <span className="badge outline">{a.readingMinutes} دقائق قراءة</span>
            <span className="badge outline">للصفوف {a.grades.join("، ")}</span>
          </div>
          <h1>{a.title}</h1>
          <p>{a.deck}</p>
        </div>
      </section>

      <section className="section">
        <div className="container reader">
          <div className="article-body">
            <div className="lead-cover">
              <img src={a.cover.src} srcSet={srcSet(a)} sizes="(max-width: 960px) 100vw, 760px" width={a.cover.width} height={a.cover.height} alt={a.cover.alt} />
            </div>
            <div className="card goal"><strong>هدف التعلّم: </strong>{a.learningGoal}</div>

            {a.sections.map((s, i) => (
              <div key={i} id={`s${i + 1}`}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                {s.sourceIds?.length ? (
                  <p className="ai-note">المصدر: {s.sourceIds.map((id) => <a key={id} href={`#src-${id}`}>[{sourceNo(id)}]</a>)}</p>
                ) : null}
                {i === 1 && a.diagram && (
                  <figure>
                    <img src={a.diagram.src} alt={a.diagram.alt} className="card" style={{ padding: 8, width: "100%" }} />
                    <figcaption>{a.diagram.caption}</figcaption>
                  </figure>
                )}
              </div>
            ))}

            <h2 id="activity">{a.activity.title}</h2>
            <div className="card activity">
              <p className="meta">{a.activity.minutes} دقائق</p>
              <ol>{a.activity.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </div>

            <h2>خلاصات</h2>
            <ul>{a.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>

            <Quiz q={a.question} />

            {a.sources.length > 0 && (
              <>
                <h2>المصادر</h2>
                <ol>
                  {a.sources.map((s) => <li key={s.id} id={`src-${s.id}`}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></li>)}
                </ol>
              </>
            )}
            <p className="ai-note">{a.attribution}. الصور توضيحية مولّدة، والأشخاص فيها خياليون.</p>
          </div>

          <aside className="toc card">
            <strong>في هذا المقال</strong>
            <ol>
              {a.sections.map((s, i) => <li key={i}><a href={`#s${i + 1}`}>{s.heading}</a></li>)}
              <li><a href="#activity">النشاط</a></li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>اقرأ أيضًا</h2>
          <div className="grid articles">
            {a.related.map((slug) => getArticle(slug)).filter(Boolean).map((r) => <ArticleCard key={r!.slug} a={r!} />)}
          </div>
        </div>
      </section>
    </>
  );
}
