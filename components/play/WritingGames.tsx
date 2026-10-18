"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Check, RotateCcw } from "lucide-react";
import { GameArt } from "./Arena";
import { QuizRound } from "./GamePlayer";
import { useProgress } from "./Progress";
import { story } from "@/content/story";

type Finish = { onFinish: () => void };
export function StoryGame({ onFinish }: Finish) {
  const [node, setNode] = useState("start"),
    [trail, setTrail] = useState<string[]>([]),
    [reflection, setReflection] = useState("");
  const { saveDraft } = useProgress();
  const scene = story[node];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (node !== "start") heading.current?.focus();
  }, [node]);
  return (
    <div className="play-story">
      <div className="play-story-picture">
        <GameArt id="story" />
        <span>قصة تفاعلية أصلية</span>
      </div>
      <div className="play-story-text">
        <span className="eyebrow">المشهد {trail.length + 1}</span>
        <h2 ref={heading} tabIndex={-1}>
          {scene.title}
        </h2>
        <p>{scene.text}</p>
        {scene.clue && (
          <aside className="play-story-clue">
            <strong>في دفتر الأدلة</strong>
            <p>{scene.clue}</p>
          </aside>
        )}
        {scene.choices ? (
          <div className="play-story-choices">
            {scene.choices.map((c) => (
              <button
                key={c.next}
                onClick={() => {
                  setTrail((t) => [...t, c.text]);
                  setNode(c.next);
                }}
              >
                {c.text}
                <ArrowLeft size={17} />
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="play-feedback success">
              <strong>نهايتك: {scene.ending}</strong>
              <p>{scene.takeaway}</p>
            </div>
            <label className="play-field">
              ما الاختيار الذي أثّر في النهاية؟ وماذا كنت ستغيّر؟
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                minLength={20}
                maxLength={2000}
                rows={4}
                placeholder="اكتب تأمّلك في 20 حرفًا على الأقل…"
              />
            </label>
            <div className="actions">
              <button
                className="btn"
                disabled={reflection.trim().length < 20}
                onClick={() => {
                  saveDraft(
                    "story-reflection",
                    `النهاية: ${scene.ending}\nالمسار: ${trail.join(" ← ")}\n${reflection}`,
                  );
                  onFinish();
                }}
              >
                احفظ تأمّلي وأنهِ القصة
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  setNode("start");
                  setTrail([]);
                  setReflection("");
                }}
              >
                <RotateCcw size={16} />
                استكشف طريقًا آخر
              </button>
            </div>
          </>
        )}
        {trail.length > 0 && (
          <details>
            <summary>اختياراتي في القصة</summary>
            <ol>
              {trail.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
}
export type Reading = {
  slug: string;
  title: string;
  categoryLabel: string;
  excerpt: string;
  question: {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  activity: { title: string; minutes: number; steps: string[] };
};
export function ArticleGame({
  articles,
  onFinish,
}: Finish & { articles: Reading[] }) {
  const { complete, saveDraft, progress } = useProgress();
  const [slug, setSlug] = useState(articles[0]?.slug || ""),
    [passed, setPassed] = useState(false),
    [reflection, setReflection] = useState("");
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("article");
    if (query && articles.some((a) => a.slug === query)) setSlug(query);
  }, [articles]);
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <p>لا يوجد مقال متاح حاليًا.</p>;
  return (
    <div>
      <label className="play-field">
        اختر مقالًا من مجلة آفاق
        <select
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setPassed(false);
            setReflection("");
          }}
        >
          {articles.map((a) => (
            <option value={a.slug} key={a.slug}>
              {a.title}
              {progress.completed[`reading:${a.slug}`] ? " ✓" : ""}
            </option>
          ))}
        </select>
      </label>
      <div className="play-reading-prompt">
        <BookOpen size={30} />
        <div>
          <span className="eyebrow">{article.categoryLabel}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <Link
            className="btn ghost"
            target="_blank"
            href={`/articles/${article.slug}`}
          >
            اقرأ المقال في تبويب جديد ↗
          </Link>
        </div>
      </div>
      {!passed ? (
        <QuizRound
          key={slug}
          items={[
            {
              question: article.question.text,
              options: article.question.options,
              answer: article.question.correctIndex,
              hint: "راجع الفكرة الأساسية والأمثلة في المقال قبل اختيار الإجابة.",
              explanation: article.question.explanation,
            },
          ]}
          onFinish={() => setPassed(true)}
        />
      ) : (
        <div className="play-reading-task">
          <span className="eyebrow">
            <Check size={17} />
            فهمت الفكرة. الآن طبّقها.
          </span>
          <h3>{article.activity.title}</h3>
          <ol>
            {article.activity.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <label className="play-field">
            اكتب كيف ستطبّق الفكرة أو ما الذي لاحظته
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="اكتب 20 حرفًا على الأقل…"
            />
          </label>
          <button
            className="btn"
            disabled={reflection.trim().length < 20}
            onClick={() => {
              saveDraft(`reading:${slug}`, reflection.trim());
              complete(`reading:${slug}`);
              onFinish();
            }}
          >
            احفظ تطبيق الفكرة وأنهِ التحدّي
          </button>
        </div>
      )}
    </div>
  );
}
