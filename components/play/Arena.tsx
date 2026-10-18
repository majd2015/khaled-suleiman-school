"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Sparkles,
  Clock3,
  Check,
  Compass,
  BookOpen,
  Search,
  Gamepad2,
  FlaskConical,
  HeartHandshake,
  Code2,
  Trophy,
} from "lucide-react";
import { games, type Game } from "@/content/games";
import { dailyIndex } from "@/lib/play-engine";
import { normalizeArabic } from "@/lib/article-utils";
import { StorageNotice, useProgress } from "./Progress";
export function GameArt({
  id,
  priority = false,
  className = "",
  alt = "",
}: {
  id: string;
  priority?: boolean;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={className}
      src={`/assets/play/${id}-800.webp`}
      srcSet={`/assets/play/${id}-480.webp 480w, /assets/play/${id}-800.webp 800w, /assets/play/${id}-1440.webp 1440w`}
      sizes="(max-width:600px) 92vw, (max-width:1000px) 46vw, 580px"
      width={1440}
      height={1080}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
const categoryIcon: Record<string, typeof Sparkles> = {
  "علوم ومنطق": FlaskConical,
  "رياضة ورياضيات": Trophy,
  "لغة وإبداع": BookOpen,
  "قيم وحياة": HeartHandshake,
  "برمجة وتصميم": Code2,
};
export function GameCard({ game }: { game: Game }) {
  const { progress } = useProgress(),
    done = !!progress.completed[game.slug];
  const Icon = categoryIcon[game.category] || Gamepad2;
  return (
    <Link
      href={`/play/${game.slug}`}
      className={`play-card play-tone-${game.color}`}
    >
      <div className="play-card-art">
        <GameArt id={game.image} />
        <span className="play-card-type">
          <Icon size={15} />
          {game.category}
        </span>
        {done && (
          <span className="play-done">
            <Check size={16} />
            أنجزته
          </span>
        )}
      </div>
      <div className="play-card-copy">
        <div className="play-card-meta">
          <span>
            <Clock3 size={14} />
            نحو {game.minutes} دقائق
          </span>
          <span>السابع–التاسع</span>
        </div>
        <h3>{game.title}</h3>
        <p>{game.subtitle}</p>
        <div className="play-card-bottom">
          <span>{game.skill}</span>
          <span className="play-arrow" aria-hidden="true">
            <ArrowUpLeft size={22} />
          </span>
        </div>
      </div>
    </Link>
  );
}
export default function Arena() {
  const [category, setCategory] = useState("الكل"),
    [search, setSearch] = useState(""),
    [daily, setDaily] = useState<number | null>(null);
  const { progress } = useProgress();
  useEffect(() => setDaily(dailyIndex(new Date(), games.length)), []);
  const completed = games.filter((g) => progress.completed[g.slug]).length;
  const list = games.filter(
    (g) =>
      (category === "الكل" || g.category === category) &&
      normalizeArabic(g.title + " " + g.subtitle + " " + g.category).includes(
        normalizeArabic(search),
      ),
  );
  return (
    <>
      <section className="play-hero container">
        <div className="play-hero-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            ساحة التحدّيات / مساحة لفضولك
          </span>
          <h1>
            الفكرة تبدأ بسؤال.
            <br />
            <span className="gradient-text">والمتعة تبدأ بتجربة.</span>
          </h1>
          <p>
            حلّ لغزًا، برمج مسارًا، أو غيّر نهاية حكاية.
            <br />
            هنا كل محاولة تفتح لك أفقًا جديدًا.
          </p>
          <div className="actions">
            <a href="#games" className="btn">
              اختر مغامرتك <ArrowLeft size={18} />
            </a>
            <Link href="/play/passport" className="btn ghost">
              <Compass size={18} />
              جواز تعلّمي
            </Link>
          </div>
          <div className="play-hero-facts">
            <span>
              <strong>{games.length}</strong> تجارب مختلفة
            </span>
            <span>
              <strong>5</strong> عوالم للمعرفة
            </span>
            <span>
              <strong>∞</strong> مساحة للمحاولة
            </span>
          </div>
        </div>
        <div className="play-hero-art">
          <GameArt
            id="learning-landscape-v2"
            priority
            alt="كتاب مفتوح وجسر وأدوات تعلم في مشهد ورقي دافئ"
          />
          <span className="play-float play-float-one">
            <Sparkles size={18} />
            جرّب. اكتشف. ابتكر.
          </span>
          <span className="play-float play-float-two">
            <Check size={18} />
            الخطأ بداية التعلّم
          </span>
        </div>
      </section>
      <section className="container play-dashboard" aria-label="بداية رحلتك">
        <div className="play-daily">
          <span className="play-square">
            <Sparkles />
          </span>
          <div>
            <small>اقتراح اليوم</small>
            <h2>
              {daily === null ? "مغامرة جديدة تنتظرك" : games[daily].title}
            </h2>
            <p>اختيار يتغيّر يوميًا. جرّبه في الوقت الذي يناسبك.</p>
          </div>
          <Link
            href={daily === null ? "#games" : `/play/${games[daily].slug}`}
            className="play-arrow"
            aria-label="افتح اقتراح اليوم"
          >
            <ArrowUpLeft />
          </Link>
        </div>
        <Link className="play-progress-link" href="/play/passport">
          <Compass size={24} />
          <div>
            <strong>رحلتك حتى الآن</strong>
            <span>
              اكتملت {completed} من {games.length} تجارب
            </span>
            <progress
              max={games.length}
              value={completed}
              aria-label="التجارب المكتملة"
            />
          </div>
          <ArrowUpLeft size={22} />
        </Link>
      </section>
      <section className="container play-catalog" id="games">
        <div className="section-title">
          <div>
            <span className="eyebrow">لكل فضول مغامرة</span>
            <h2>بأي عالم نبدأ؟</h2>
          </div>
          <label className="play-search">
            <Search size={19} />
            <span className="sr-only">ابحث عن تجربة</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن تجربة…"
            />
          </label>
        </div>
        <div className="play-filters" aria-label="تصفية التجارب">
          {["الكل", ...new Set(games.map((g) => g.category))].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="play-result-count" aria-live="polite">
          التجارب المتاحة: {list.length}
        </p>
        <div className="play-grid">
          {list.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
        {list.length === 0 && (
          <div className="play-empty">
            <Search size={35} />
            <h3>لنجرّب كلمة أخرى</h3>
            <p>يمكنك أيضًا العودة إلى كل المجالات.</p>
            <button
              className="btn ghost"
              onClick={() => {
                setSearch("");
                setCategory("الكل");
              }}
            >
              اعرض كل التجارب
            </button>
          </div>
        )}
      </section>
      <section className="container play-bottom-grid">
        <div className="play-community-callout">
          <HeartHandshake size={34} />
          <div>
            <span className="eyebrow">كل تجربة تترك أثرًا</span>
            <h2>فكرة اليوم… اكتشاف الغد.</h2>
            <p>
              تابع تجاربك، واحتفظ بتأملك بعد الحكاية، وعد إلى ما تريد استكشافه.
            </p>
            <Link className="btn ghost" href="/play/passport">
              شاهد جواز تعلّمك <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
        <div className="play-lab-callout">
          <FlaskConical size={32} />
          <h3>تحب الاكتشاف بالمجسّمات؟</h3>
          <p>المختبر التفاعلي فيه خمسة نماذج يمكنك تدويرها واستكشافها.</p>
          <Link className="text-link" href="/discover">
            إلى المختبر <ArrowUpLeft size={18} />
          </Link>
        </div>
      </section>
      <div className="container">
        <StorageNotice />
      </div>
    </>
  );
}
