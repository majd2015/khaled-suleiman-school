import Link from "next/link";
import { site } from "@/site.config";
import { announcements, challenges, didYouKnow, events, grades, newsletters } from "@/content/data";
import { articles, getArticle, srcSet } from "@/content/articles";
import { getAllNews } from "@/lib/news";
import { IconBadge } from "@/components/icons";
import { AnnouncementCard, NewsCard, Pending, formatDate } from "@/components/ui";

export const revalidate = 900;

// صور الكولاج من أغلفة المجلة (مولّدة، والأشخاص فيها خياليون).
const collage = ["teamwork-every-voice", "paper-bridge", "plant-sunlight", "welcome-classmate"].map((s) => getArticle(s)!);

export default async function Home() {
  const latest = (await getAllNews()).slice(0, 3);
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const today = challenges[new Date().getDate() % challenges.length];
  const fact = didYouKnow[new Date().getDate() % didYouKnow.length];
  const [featured, ...more] = articles;
  const issue = newsletters[0];
  const words = site.tagline.split("•").map((w) => w.trim());

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">مدرسة إعدادية · {site.grades}</span>
            <h1>
              <span className="w1">{words[0]}.</span>
              <span className="w2">{words[1]}.</span>
              <span className="w3">{words[2]}.</span>
            </h1>
            <p className="lead">
              أخبار {site.name} وإعلاناتها ومواعيدها في مكان واحد، ومجلة بمقالات قصيرة، وتحديات ومساحات يشارك فيها الطلاب.
            </p>
            <p className="lead" style={{ fontSize: "1rem" }}>
              {site.yearTheme.title} {site.yearTheme.year}: <Pending>{site.yearTheme.text}</Pending>
            </p>
            <div className="actions">
              <Link href="/articles" className="btn">اقرأ مجلة المدرسة <span aria-hidden="true">←</span></Link>
              <Link href="/grades" className="btn ghost">الصفوف</Link>
            </div>
          </div>

          <div className="collage" aria-hidden="true">
            <Link href={`/challenges/${today.slug}`} className="sticker" style={{ color: "var(--text)" }} tabIndex={-1}>سؤال<br />كل يوم!</Link>
            <div className="frame">
              <div><img src={collage[0].cover.srcSet[0].src} alt="" /></div>
              <div><img src={collage[1].cover.srcSet[0].src} alt="" /></div>
              <div><img src={collage[2].cover.srcSet[0].src} alt="" /></div>
              <div className="cell-note"><span>نتعلّم معًا، ونشارك ما تعلّمناه<small>مع طلابنا وأهاليهم</small></span></div>
            </div>
            <div className="blob"><img src={collage[3].cover.srcSet[0].src} alt="" /></div>
            <div className="grades-tag">السابع • الثامن • التاسع</div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container bento">
          <div>
            <article className="card feature">
              <Link href={`/articles/${featured.slug}`} className="cover" tabIndex={-1} aria-hidden="true">
                <img src={featured.cover.srcSet[1].src} srcSet={srcSet(featured)} sizes="(max-width: 900px) 100vw, 680px" alt="" />
                <span className="badge yellow">{featured.readingMinutes} دقائق قراءة</span>
              </Link>
              <div className="body">
                <span className="badge outline">من مجلة المدرسة</span>
                <h3 style={{ marginTop: 12 }}><Link href={`/articles/${featured.slug}`} style={{ color: "inherit" }}>{featured.title}</Link></h3>
                <p className="pull">«{featured.deck}»</p>
                <div className="tags">
                  <span className="badge">{featured.categoryLabel}</span>
                  <span className="badge">للصفوف {featured.grades.join("، ")}</span>
                </div>
                <Link href={`/articles/${featured.slug}`} className="btn small">اقرأ المقال <span aria-hidden="true">←</span></Link>
              </div>
            </article>
            <div className="row-links">
              {more.slice(0, 3).map((a) => (
                <Link key={a.slug} href={`/articles/${a.slug}`} className="row-link">
                  {a.title}<small>{a.readingMinutes} دقائق</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="stack-col">
            <div className="card mint">
              <span className="badge yellow">شارك</span>
              <h3 style={{ fontSize: "1.6rem", marginTop: 10 }}>الكلمة الطيبة</h3>
              <p>اكتب كلمة شكر لمعلّم أو زميل أو لأحد في البيت. يقرأها معلّم قبل أن تظهر في الموقع.</p>
              <Link href="/participate/kind-word" className="btn">اكتب كلمتك</Link>
            </div>
            <div className="card">
              <div className="meta" style={{ justifyContent: "space-between" }}>
                <span className="badge outline">تحدّي اليوم</span>
                <span className="live">جديد كل يوم</span>
              </div>
              <h3>{today.title}</h3>
              <p>{today.subject} · {today.level} · {today.minutes} دقائق</p>
              <Link href={`/challenges/${today.slug}`}>ابدأ التحدّي ←</Link>
            </div>
            <div className="card">
              <IconBadge name="values" />
              <h3>هل تعلم؟</h3>
              <p>{fact}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container news-band">
          <div>
            <span className="badge outline">النشرة الشهرية</span>
            <h2 style={{ margin: "14px 0" }}>نشرة المدرسة الشهرية</h2>
            <p style={{ color: "var(--body)" }}>قصص من الصفوف، ومواعيد الشهر القادم، وسؤال نتحدث عنه في البيت.</p>
            <Link href={`/newsletter/${issue.slug}`} className="btn ghost">اقرأ العدد كاملًا <span aria-hidden="true">←</span></Link>
          </div>
          <Link href={`/newsletter/${issue.slug}`} className="ticket">
            <div>
              <span className="date">{issue.month}</span>
              <h3>{issue.title}</h3>
              <p style={{ color: "var(--body)", margin: 0 }}>{issue.stories.map((s) => s.title).join(" • ")}</p>
            </div>
            <img src={getArticle("shared-school-space")!.cover.srcSet[0].src} alt="" />
            <span className="stamp">{issue.title}</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>آخر الأخبار</h2>
            <Link href="/news">كل الأخبار ←</Link>
          </div>
          <div className="grid">
            {latest.map((n) => <NewsCard key={n.slug} item={n} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}>
          <div>
            <div className="section-title">
              <h2>إعلانات</h2>
              <Link href="/announcements">الكل ←</Link>
            </div>
            <ul className="ann-list">
              {announcements.slice(0, 3).map((a) => <AnnouncementCard key={a.id} a={a} />)}
            </ul>
          </div>
          <div>
            <div className="section-title">
              <h2>مواعيد قادمة</h2>
              <Link href="/calendar">الرزنامة ←</Link>
            </div>
            <ul className="ann-list">
              {upcoming.map((e) => (
                <li key={e.id} className="card">
                  <div className="meta">
                    <span className={`type-${e.type}`}>{e.type}</span>
                    <span>{formatDate(e.date)}</span>
                    {!e.confirmed && <span className="badge">مقترح</span>}
                  </div>
                  <h3>{e.title}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>الصفوف</h2>
          <div className="grid">
            {grades.map((g) => (
              <Link key={g.id} href={`/grades/${g.id}`} className="card link grade-card" style={{ color: "inherit", ["--gc" as string]: g.color }}>
                <h3>{g.name}</h3>
                <p className="motto">{g.motto}</p>
                <p>{g.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
