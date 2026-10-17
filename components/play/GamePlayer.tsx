"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lightbulb,
  RotateCcw,
  Compass,
  Sparkles,
  LockKeyhole,
  UnlockKeyhole,
  Clock3,
} from "lucide-react";
import {
  games,
  questions,
  learningSources,
  type Game,
  type Question,
} from "@/content/games";
import { useProgress, StorageNotice } from "./Progress";
import { GameArt } from "./Arena";
import { Experiment, RobotGame, CityGame } from "./Simulations";
import {
  StoryGame,
  CreativeGame,
  ArticleGame,
  type Reading,
} from "./WritingGames";
export function QuizRound({
  items,
  onFinish,
  escape = false,
}: {
  items: Question[];
  onFinish: () => void;
  escape?: boolean;
}) {
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [checked, setChecked] = useState(false),
    [hint, setHint] = useState(false);
  const question = items[index],
    correct = checked && selected === question.answer,
    heading = useRef<HTMLHeadingElement>(null);
  const next = () => {
    if (index === items.length - 1) {
      onFinish();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
    setHint(false);
    setTimeout(() => heading.current?.focus(), 0);
  };
  return (
    <div className="play-quiz">
      <div className="play-stage-top">
        <span>
          {escape ? "القفل" : "الموقف"} {index + 1} من {items.length}
        </span>
        <progress
          value={index}
          max={items.length}
          aria-label="المراحل المنجزة"
        />
      </div>
      {escape && (
        <div className="play-locks" aria-label={`${index} أقفال مفتوحة`}>
          {items.map((_, i) => (
            <span
              key={i}
              className={i < index ? "unlocked" : i === index ? "current" : ""}
            >
              {i < index ? <UnlockKeyhole /> : <LockKeyhole />}
              <small>{i + 1}</small>
            </span>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selected !== null) setChecked(true);
        }}
      >
        <h2 ref={heading} tabIndex={-1} id="game-question">
          {question.question}
        </h2>
        {question.display && (
          <div className="play-question-display">{question.display}</div>
        )}
        <fieldset aria-labelledby="game-question" disabled={correct}>
          <legend className="sr-only">اختر إجابة</legend>
          {question.options.map((option, i) => (
            <label
              className={`play-option ${selected === i ? "selected" : ""} ${correct && i === selected ? "correct" : ""}`}
              key={option}
            >
              <input
                type="radio"
                name="game-answer"
                required
                checked={selected === i}
                onChange={() => {
                  setSelected(i);
                  setChecked(false);
                }}
              />
              <span>{option}</span>
              {correct && i === selected && <Check size={20} />}
            </label>
          ))}
        </fieldset>
        <div className="actions">
          {!correct && (
            <button className="btn" type="submit" disabled={selected === null}>
              تحقّق من اختياري
            </button>
          )}
          <button
            type="button"
            className="btn ghost"
            aria-expanded={hint}
            onClick={() => setHint(!hint)}
          >
            <Lightbulb size={18} />
            {hint ? "إخفاء التلميح" : "أحتاج تلميحًا"}
          </button>
        </div>
      </form>
      {hint && <p className="play-hint">{question.hint}</p>}
      {checked && (
        <div
          className={`play-feedback ${correct ? "success" : ""}`}
          role="status"
        >
          <strong>
            {correct ? "وصلت إلى الفكرة!" : "لنجرّب التفكير بطريقة أخرى."}
          </strong>
          <p>
            {correct
              ? question.explanation
              : question.hint + " يمكنك تغيير اختيارك وإعادة المحاولة."}
          </p>
        </div>
      )}
      {correct && (
        <button className="btn" onClick={next}>
          {index === items.length - 1
            ? "أنهِ التجربة"
            : "تابع إلى المرحلة التالية"}
          <ArrowLeft size={18} />
        </button>
      )}
    </div>
  );
}
export default function GamePlayer({
  game,
  reading,
}: {
  game: Game;
  reading?: Reading[];
}) {
  const { complete, progress } = useProgress();
  const [done, setDone] = useState(false),
    [session, setSession] = useState(0);
  const result = useRef<HTMLDivElement>(null);
  const finish = () => {
    complete(game.slug);
    setDone(true);
  };
  useEffect(() => {
    if (done) result.current?.focus();
  }, [done]);
  const related = games
    .filter(
      (g) =>
        g.slug !== game.slug &&
        (g.category === game.category || g.kind !== game.kind),
    )
    .slice(0, 3);
  return (
    <div className={`container play-player play-tone-${game.color}`}>
      <nav className="play-breadcrumb" aria-label="مسار الصفحة">
        <Link href="/play">
          <ArrowRight size={17} />
          ساحة التحدّيات
        </Link>
        <Link href="/play/passport">
          <Compass size={17} />
          جواز تعلّمي
        </Link>
      </nav>
      <header className="play-game-heading">
        <div>
          <span className="eyebrow">
            {game.category} / للصفوف السابع–التاسع
          </span>
          <h1>{game.title}</h1>
          <p>{game.subtitle}</p>
          <div className="play-card-meta">
            <span>
              <Clock3 size={16} />
              نحو {game.minutes} دقائق
            </span>
            <span>{game.skill}</span>
            {progress.completed[game.slug] && (
              <span>
                <Check size={16} />
                سبق أن أنجزت هذه التجربة
              </span>
            )}
          </div>
        </div>
        <GameArt id={game.image} />
      </header>
      <div className="play-workbench">
        {done ? (
          <div
            className="play-complete"
            role="status"
            ref={result}
            tabIndex={-1}
          >
            <span className="play-complete-symbol">
              <Sparkles size={42} />
            </span>
            <span className="eyebrow">خطوة جديدة في رحلتك</span>
            <h2>اكتشفت فكرة تستحق أن تبقى.</h2>
            <p>
              أكملت «{game.title}». ستجدها في جواز تعلّمك، ويمكنك العودة
              والمحاولة بأي وقت.
            </p>
            <div className="actions">
              <Link href="/play/passport" className="btn">
                <Compass size={18} />
                شاهد جواز تعلّمي
              </Link>
              <button
                className="btn ghost"
                onClick={() => {
                  setSession((s) => s + 1);
                  setDone(false);
                }}
              >
                <RotateCcw size={17} />
                جرّب من جديد
              </button>
            </div>
          </div>
        ) : (
          <div key={session}>
            {game.kind === "quiz" && (
              <QuizRound
                items={questions[game.slug]}
                onFinish={finish}
                escape={game.slug === "escape-lab"}
              />
            )}
            {game.kind === "experiment" && <Experiment onFinish={finish} />}
            {game.kind === "robot" && <RobotGame onFinish={finish} />}
            {game.kind === "city" && <CityGame onFinish={finish} />}
            {game.kind === "story" && <StoryGame onFinish={finish} />}
            {game.kind === "creative" && <CreativeGame onFinish={finish} />}
            {game.kind === "article" && (
              <ArticleGame articles={reading || []} onFinish={finish} />
            )}
          </div>
        )}
      </div>
      <StorageNotice />
      {["living-values", "news-detective", "predict-test"].includes(
        game.slug,
      ) && (
        <details className="play-sources">
          <summary>مصادر الفكرة وملاحظات للمعلم</summary>
          <p>
            المواقف مؤلّفة للتعلّم. المحاكاة نموذج مبسّط، والمواقف القيمية لا
            تقيس أخلاق الطالب أو تدينه.
          </p>
          <ul>
            {learningSources
              .filter((_, i) =>
                game.slug === "living-values"
                  ? i >= 3
                  : game.slug === "predict-test"
                    ? i === 0
                    : i === 1 || i === 2,
              )
              .map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
          </ul>
        </details>
      )}
      <section className="play-next">
        <h2>ما مغامرتك التالية؟</h2>
        <div>
          {related.map((g) => (
            <Link key={g.slug} href={`/play/${g.slug}`}>
              <span>{g.title}</span>
              <ArrowUpLeftIcon />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
function ArrowUpLeftIcon() {
  return <ArrowLeft size={18} />;
}
