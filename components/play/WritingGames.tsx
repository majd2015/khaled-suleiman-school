"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Download,
  Check,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { GameArt } from "./Arena";
import { QuizRound } from "./GamePlayer";
import { downloadText, useProgress } from "./Progress";
type Finish = { onFinish: () => void };
const story: Record<
  string,
  {
    title: string;
    text: string;
    choices?: { text: string; next: string }[];
    ending?: string;
  }
> = {
  start: {
    title: "المشروع الذي اختفى",
    text: "صباح معرض العلوم، وصلت مجموعة الطلاب إلى الطاولة فوجدت نموذج الجسر مفقودًا. بقيت بطاقة صغيرة: «نقلناه إلى مكان أكثر أمانًا». لا يوجد اسم على البطاقة، والعرض يبدأ قريبًا. أنت ضمن الفريق؛ ماذا تقترح؟",
    choices: [
      { text: "نسأل المشرف ونراجع ما حدث بهدوء", next: "ask" },
      { text: "نبحث في الأماكن القريبة ونقسّم المهمة", next: "search" },
      { text: "نتهم المجموعة المجاورة فورًا", next: "accuse" },
    ],
  },
  ask: {
    title: "معلومة جديدة",
    text: "قال المشرف إن الطاولة كانت قرب نافذة مفتوحة، لكنه لم ينقل النموذج بنفسه. اقترح سؤال فريق التنظيم. أمامكم وقت محدود، لكن يمكن توزيع الأدوار.",
    choices: [
      { text: "طالب يسأل التنظيم وآخر يجهّز شرح المشروع", next: "organize" },
      { text: "نترك التحضير ونبحث جميعًا في المكان نفسه", next: "crowd" },
    ],
  },
  search: {
    title: "أثر في المكتبة",
    text: "وجدتم على عربة قرب المكتبة قطعة من نفس الورق المستخدم في النموذج. هذا دليل محتمل، لكنه لا يخبركم من نقل المشروع أو لماذا.",
    choices: [
      { text: "نسأل مسؤولة المكتبة قبل لمس الأشياء", next: "found" },
      { text: "نلتقط صورة وننشر أن المشروع سُرق", next: "repair" },
    ],
  },
  accuse: {
    title: "هل نعرف ما يكفي؟",
    text: "تفاجأ الطلاب بالاتهام. أوضحوا أنهم كانوا في ساحة المدرسة، وأنهم رأوا فريق التنظيم يحمل صندوقًا. أصبح الجو متوترًا، لكن ما زالت أمامكم فرصة لتصحيح التصرف.",
    choices: [
      { text: "نعتذر عن الاتهام ونبحث عن الدليل", next: "organize" },
      { text: "نطلب من المشرف تهدئة النقاش والتحقق", next: "repair" },
    ],
  },
  crowd: {
    title: "الوقت يمر",
    text: "وصل الجميع إلى المخزن دون أن يبقى أحد عند الطاولة. وجدتم مسؤول التنظيم، لكنه يحتاج وصفًا دقيقًا للنموذج. اكتشفتم أن تقسيم الأدوار كان سيساعد.",
    choices: [
      { text: "نصف النموذج ويعود بعضنا لتجهيز العرض", next: "found" },
      { text: "نجهّز عرضًا بديلًا ونواصل البحث بهدوء", next: "backup" },
    ],
  },
  organize: {
    title: "الفريق يكمل بعضه",
    text: "عرفتم أن فريق التنظيم نقل النموذج بعيدًا عن النافذة لحمايته من المطر. كان يمكن تجنّب القلق بكتابة اسم المسؤول والمكان على البطاقة. عاد المشروع، وكان شرحكم جاهزًا.",
    ending: "تعاون ودليل",
  },
  found: {
    title: "عاد الجسر",
    text: "النموذج في المكتبة فعلًا، وقد نُقل لحمايته. شكرتم من ساعدكم، واقترحتم سجلًا بسيطًا يوضح مكان كل مشروع واسم من نقله. حوّلتم الموقف إلى تحسين يفيد الجميع.",
    ending: "سؤال يصنع حلًا",
  },
  repair: {
    title: "إصلاح الأثر",
    text: "ساعد المشرف على التحقق، وعرفتم أن المشروع لم يُسرق. صحّحتم الخبر واعتذرتم عمّا سبّبته العجلة. ليس كل قرار موفقًا من البداية؛ الاعتراف والتصحيح جزء من التعلّم.",
    ending: "شجاعة المراجعة",
  },
  backup: {
    title: "الفكرة أهم من الشكل",
    text: "عرضتم صور مراحل العمل وشرحتم كيف يحمل الجسر الأوزان. وصل النموذج قبل نهاية المعرض. تعلّمتم أن وجود خطة بديلة يخفف الارتباك ويساعد الفريق على الاستمرار.",
    ending: "مرونة وخطة بديلة",
  },
};
export function StoryGame({ onFinish }: Finish) {
  const [node, setNode] = useState("start"),
    [trail, setTrail] = useState<string[]>([]),
    [reflection, setReflection] = useState("");
  const { saveDraft } = useProgress();
  const scene = story[node];
  return (
    <div className="play-story">
      <div className="play-story-picture">
        <GameArt id="story" />
        <span>قصة تفاعلية أصلية</span>
      </div>
      <div className="play-story-text">
        <span className="eyebrow">المشهد {trail.length + 1}</span>
        <h2 tabIndex={-1}>{scene.title}</h2>
        <p>{scene.text}</p>
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
              <p>
                أكثر من طريق يمكن أن يحمل فكرة مفيدة. ليس الهدف الوصول إلى نهاية
                واحدة.
              </p>
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
                    `النهاية: ${scene.ending}\n${reflection}`,
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
export function CreativeGame({ onFinish }: Finish) {
  const { progress, ready, saveDraft } = useProgress();
  const [image, setImage] = useState("story"),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [reviewed, setReviewed] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (ready) {
      const savedImage = progress.drafts["creative-image"];
      if (["story", "city", "robot"].includes(savedImage)) setImage(savedImage);
      const draft = progress.drafts["creative-writing"];
      if (draft) {
        const [savedTitle, ...rest] = draft.split("\n");
        setTitle(savedTitle);
        setBody(rest.join("\n"));
      }
    }
  }, [ready]);
  const valid = title.trim().length >= 3 && body.trim().length >= 80;
  const text = () => `${title.trim()}\n${body.trim()}`;
  return (
    <div>
      <div className="play-instructions">
        <strong>صورة واحدة، أفكار لا تنتهي.</strong>
        <p>
          اختر صورة، اكتب عنوانًا وقصة قصيرة أو تفسيرًا مبتكرًا. راجع النص
          بنفسك؛ لا توجد علامة آلية تحكم على إبداعك.
        </p>
      </div>
      <div className="play-creative-grid">
        <div>
          <div className="play-creative-image">
            <GameArt
              id={image}
              alt={
                image === "city"
                  ? "حي زجاجي مصغّر فيه مكتبة وحديقة وملعب ومسار دراجات وألواح شمسية."
                  : image === "robot"
                    ? "روبوت على شبكة مربعات زجاجية أمامه طريق وعوائق برتقالية ووجهة مضيئة."
                    : "كتاب مفتوح تخرج منه طرق متفرّعة نحو بوصلة وفقاعات حوار ونبتة."
              }
            />
          </div>
          <div className="play-presets">
            {[
              ["story", "حكاية"],
              ["city", "مدينة"],
              ["robot", "روبوت"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={image === id}
                className={image === id ? "active" : ""}
                onClick={() => setImage(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="play-hint">
            <strong>أسئلة تفتح الفكرة</strong>
            <p>
              ماذا حدث قبل هذه اللحظة؟ ما المشكلة؟ كيف يتغيّر المشهد بعد قرار
              ذكي أو تصرّف لطيف؟
            </p>
          </div>
        </div>
        <div>
          <label className="play-field">
            عنوان فكرتك
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setReviewed(false);
              }}
              maxLength={100}
              placeholder="عنوان من اختيارك…"
            />
          </label>
          <label className="play-field">
            قصتك أو تفسيرك
            <textarea
              rows={9}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setReviewed(false);
              }}
              maxLength={3000}
              placeholder="ابدأ من تفصيل صغير في الصورة…"
            />
          </label>
          <small>{body.trim().length} حرفًا / 80 حرفًا على الأقل</small>
          <label className="play-checkbox">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
            />
            راجعت وضوح الفكرة، وترابط الجمل، وعلامات الترقيم.
          </label>
          <div className="actions">
            <button
              className="btn ghost"
              disabled={!title.trim() && !body.trim()}
              onClick={() => {
                saveDraft("creative-writing", text());
                saveDraft("creative-image", image);
                setNotice("حُفظت المسودة. يمكنك العودة إليها في نفس المتصفح.");
              }}
            >
              <PenLine size={16} />
              حفظ مسودة
            </button>
            <button
              className="btn ghost"
              disabled={!valid}
              onClick={() => downloadText("afaq-my-story.txt", text())}
            >
              <Download size={16} />
              تنزيل النص
            </button>
            <button
              className="btn"
              disabled={!valid || !reviewed}
              onClick={() => {
                saveDraft("creative-writing", text());
                saveDraft("creative-image", image);
                onFinish();
              }}
            >
              أنهِ تجربتي
            </button>
          </div>
          <p role="status">{notice}</p>
        </div>
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
