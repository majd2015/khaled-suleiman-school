import Link from "next/link";
import { site } from "@/site.config";
import { challenges, didYouKnow, grades } from "@/content/data";
import Illustration from "@/components/Illustration";
import { gradeIllustration } from "@/content/assets";
import { getAllNews, getAnnouncements, getEvents } from "@/lib/news";
import { IconBadge } from "@/components/icons";
import { AnnouncementCard, NewsCard, Pending, formatDate } from "@/components/ui";

export const revalidate = 60;

export default async function Home() {
  const [allNews, announcements, events] = await Promise.all([getAllNews(), getAnnouncements(), getEvents()]);
  const latest = allNews.slice(0, 3);
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const today = challenges[new Date().getDate() % challenges.length];
  const fact = didYouKnow[new Date().getDate() % didYouKnow.length];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
          <h1>{site.name}</h1>
          <p className="tagline">{site.tagline}</p>
          <p>
            {site.yearTheme.title} {site.yearTheme.year}: <Pending>{site.yearTheme.text}</Pending>
          </p>
          <div className="actions">
            <Link href="/grades" className="btn">الصفوف</Link>
            <Link href="/news" className="btn ghost">آخر الأخبار</Link>
          </div>
          </div>
          <Illustration id="home-hero" priority className="hero-art" />
        </div>
      </section>

      <div className="container">
        <div className="strip">
          <div className="card">
            <IconBadge name="challenges" />
            <h3>تحدّي اليوم</h3>
            <p>{today.title} · {today.subject}</p>
            <Link href={`/challenges/${today.slug}`}>ابدأ التحدّي ←</Link>
          </div>
          <div className="card">
            <IconBadge name="values" />
            <h3>هل تعلم؟</h3>
            <p>{fact}</p>
          </div>
          <div className="card">
            <IconBadge name="newsletter" />
            <h3>النشرة الشهرية</h3>
            <p>قصص من الصفوف وسؤال للنقاش في البيت.</p>
            <Link href="/newsletter">اقرأ العدد الأخير ←</Link>
          </div>
        </div>
      </div>

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
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
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
                <Illustration id={gradeIllustration[g.id]} color={g.color} className="card-art" />
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
