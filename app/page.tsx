import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Atom,
  ChartNoAxesCombined,
  Code2,
  Cpu,
  HeartHandshake,
  Sparkles,
  BookOpen,
  CalendarDays,
  Megaphone,
} from "lucide-react";
import Illustration from "@/components/Illustration";
import { grades, challenges, announcements, events } from "@/content/data";
import { gradeIllustration } from "@/content/assets";
import { articles } from "@/lib/articles";
import ArticleCard from "@/components/articles/ArticleCard";
import { formatDate } from "@/components/ui";

const subjects = [
  {
    name: "الرياضيات",
    text: "نكتشف الأنماط، ونفكّر بمنطق.",
    icon: ChartNoAxesCombined,
    tone: "blue",
    id: "math",
  },
  {
    name: "الفيزياء",
    text: "نسأل عن العالم، ونختبر أفكارنا.",
    icon: Atom,
    tone: "violet",
    id: "physics",
  },
  {
    name: "الحاسوب",
    text: "نحوّل الأفكار إلى خطوات وبرامج.",
    icon: Code2,
    tone: "cyan",
    id: "computing",
  },
  {
    name: "الإلكترونيات",
    text: "نصل الدوائر، ونبني حلولًا.",
    icon: Cpu,
    tone: "orange",
    id: "electronics",
  },
];
export default function Home() {
  const picks = ["curve-ball", "joke-line", "mercy-to-animals"].map(
    (slug) => articles.find((a) => a.slug === slug)!,
  );
  const challenge = challenges[0];
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> تعلّم يفتح آفاقًا / الصفوف السابع
              – التاسع
            </span>
            <h1>
              فضول اليوم.
              <br />
              <span className="gradient-text">ابتكار الغد.</span>
            </h1>
            <p className="hero-description">
              في مدرسة خالد سليمان، تبدأ الأفكار بسؤال.
              <br className="desktop-break" /> نتعلّم، نجرّب، ونكبر معًا؛ لنصنع
              أثرًا في عالمنا.
            </p>
            <div className="actions">
              <Link className="btn" href="/articles">
                ابدأ رحلة الاكتشاف <ArrowLeft size={18} />
              </Link>
              <Link className="btn ghost" href="/school">
                تعرّف على مدرستنا <ArrowUpLeft size={18} />
              </Link>
            </div>
            <div className="hero-values">
              <span>
                <Sparkles size={16} /> فضول يقودنا
              </span>
              <span>
                <HeartHandshake size={16} /> قيم تجمعنا
              </span>
              <span>
                <BookOpen size={16} /> معرفة تنمو
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <Illustration id="home-hero" priority className="hero-art" />
            <span className="floating-label label-top">
              <Atom size={18} /> فكرة تتحوّل إلى اكتشاف
            </span>
            <Link href="/discover" className="floating-label label-bottom">
              استكشف المجسّمات <ArrowUpLeft size={17} />
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="hero-bottom">
            <span>آفاق واسعة. جذور راسخة.</span>
            <span>
              علوم ومعرفة <i /> رياضة وحياة <i /> تربية وقيم
            </span>
            <a href="#knowledge" aria-label="انتقل إلى عوالم المعرفة">
              اكتشف المزيد ↓
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="knowledge">
        <div className="container knowledge-panel">
          <div className="section-title">
            <div>
              <span className="eyebrow">عوالم المعرفة / 01</span>
              <h2>
                أفكار تتصل. <span>آفاق تتّسع.</span>
              </h2>
            </div>
            <Link className="text-link" href="/discover">
              جرّب المختبر التفاعلي <ArrowUpLeft size={18} />
            </Link>
          </div>
          <div className="subject-grid">
            {subjects.map(({ name, text, icon: Icon, tone, id }) => (
              <Link
                key={id}
                href={"/discover?subject=" + id}
                className={"subject-card tone-" + tone}
              >
                <span className="glass-icon">
                  <Icon size={36} strokeWidth={1.45} />
                </span>
                <h3>{name}</h3>
                <p>{text}</p>
                <span className="round-arrow">
                  <ArrowUpLeft size={18} />
                </span>
              </Link>
            ))}
          </div>
          <p className="panel-footnote">
            والمعرفة أوسع من المختبر؛ في قصّة، وفي ملعب، وفي موقف نختار فيه
            الخير.
          </p>
        </div>
      </section>

      <section className="section magazine-home">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">مجلة آفاق / 02</span>
              <h2>
                قراءة صغيرة.
                <br className="mobile-break" /> <span>فكرة تبقى معك.</span>
              </h2>
              <p>أسئلة من حياتك، وإجابات تفتح أسئلة جديدة.</p>
            </div>
            <Link className="btn ghost" href="/articles">
              تصفّح كل المقالات <ArrowLeft size={18} />
            </Link>
          </div>
          <div className="article-grid">
            {picks.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
          <div className="magazine-topics">
            <span>اختر ما يشدّ فضولك</span>
            {[
              ["science", "العلوم"],
              ["sports", "الرياضة"],
              ["islamic", "التربية الإسلامية"],
              ["school-life", "الحياة المدرسية"],
              ["heritage", "حكايات وتراث"],
            ].map(([id, label]) => (
              <Link key={id} href={"/articles?category=" + id}>
                {label} <ArrowUpLeft size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title centered">
            <span className="eyebrow">رحلتك في مدرستنا / 03</span>
            <h2>
              ثلاث سنوات.
              <br className="mobile-break" /> خطوات نحو المستقبل.
            </h2>
            <p>لكل مرحلة أسئلتها، وتجاربها، والمساحة التي تكبر فيها.</p>
          </div>
          <div className="grade-grid">
            {grades.map((g) => (
              <Link
                href={"/grades/" + g.id}
                key={g.id}
                className={"card grade-tile grade-" + g.id}
              >
                <div className="grade-tile-top">
                  <span>{g.name}</span>
                  <span className="grade-number">{g.id}</span>
                </div>
                <Illustration
                  id={gradeIllustration[g.id]}
                  className="grade-art"
                />
                <h3>{g.motto}</h3>
                <p>{g.intro}</p>
                <span className="text-link">
                  اكتشف الصف <ArrowLeft size={17} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container participation-banner">
          <div>
            <span className="eyebrow">صوتك له مكان</span>
            <h2>
              لا تكتفِ بالمشاهدة.
              <br />
              كن جزءًا من الفكرة.
            </h2>
            <p>رأي تدعمه بدليل، كتاب توصي به، أو كلمة طيبة تصنع فرقًا.</p>
            <div className="actions">
              <Link className="btn" href="/participate">
                اكتشف مساحات المشاركة <ArrowLeft size={18} />
              </Link>
              <Link
                className="text-link"
                href={"/challenges/" + challenge.slug}
              >
                تحدَّ نفسك <ArrowUpLeft size={18} />
              </Link>
            </div>
          </div>
          <Illustration id="debate-dialogue" className="participation-art" />
        </div>
      </section>

      <section className="section">
        <div className="container participation-banner">
          <div>
            <span className="eyebrow">
              ساحة التحدّيات / فضولك يلعب دور البطولة
            </span>
            <h2>الفكرة تصبح مغامرة.</h2>
            <p>
              حلّ ألغاز المختبر، برمج مسار الروبوت، خطّط مدينة أفضل أو اختر
              نهاية الحكاية. 12 تجربة، وكل محاولة فيها فرصة للتعلّم.
            </p>
            <div className="actions">
              <Link className="btn" href="/play">
                اختر مغامرتك <ArrowLeft size={18} />
              </Link>
              <Link className="text-link" href="/play/passport">
                جواز تعلّمي <ArrowUpLeft size={18} />
              </Link>
            </div>
          </div>
          <img
            src="/assets/play/arena-hero-800.webp"
            width={800}
            height={600}
            alt="تكوين تعليمي زجاجي يجمع روبوتًا وكتابًا وكرة وألغازًا"
            loading="lazy"
            style={{ borderRadius: 30, width: "100%" }}
          />
        </div>
      </section>
      <section className="section school-updates">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">على تواصل / 04</span>
              <h2>من يوميات المدرسة.</h2>
            </div>
            <Link className="text-link" href="/news">
              الأخبار والنشاطات <ArrowLeft size={18} />
            </Link>
          </div>
          <p className="demo-notice">
            هذه إعلانات ومواعيد تجريبية لعرض التصميم، وتُستبدل ببيانات المدرسة
            المعتمدة.
          </p>
          <div className="updates-grid">
            <div className="card">
              <h3 className="inline-icon">
                <Megaphone size={21} /> لوحة الإعلانات
              </h3>
              {announcements.slice(0, 2).map((a) => (
                <Link className="update-row" key={a.id} href="/announcements">
                  <span>
                    <small>{formatDate(a.date)}</small>
                    <strong>{a.title}</strong>
                  </span>
                  <ArrowUpLeft size={18} />
                </Link>
              ))}
            </div>
            <div className="card">
              <h3 className="inline-icon">
                <CalendarDays size={21} /> من الرزنامة التجريبية
              </h3>
              {events.slice(0, 2).map((e) => (
                <Link key={e.id} className="update-row" href="/calendar">
                  <span className="date-tile">
                    {e.date.slice(8)}
                    <small>تشرين الأول</small>
                  </span>
                  <span>
                    <strong>{e.title}</strong>
                    <small>موعد تجريبي غير معتمد</small>
                  </span>
                  <ArrowUpLeft size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
