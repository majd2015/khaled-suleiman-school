"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Lightbulb,
  MessageCircle,
  HeartHandshake,
  Download,
  Check,
  Trash2,
} from "lucide-react";
import { useProgress, StorageNotice, downloadText } from "./Progress";
export default function Community() {
  const { progress, saveDraft, vote } = useProgress();
  const [project, setProject] = useState(""),
    [question, setQuestion] = useState(""),
    [notice, setNotice] = useState("");
  const entries = Object.entries(progress.drafts).filter(
    ([k, v]) => (k.startsWith("project-") || k.startsWith("question-")) && v,
  );
  const projectCount = entries.filter(([k]) => k.startsWith("project-")).length,
    questionCount = entries.filter(([k]) => k.startsWith("question-")).length;
  return (
    <div className="container play-community">
      <Link className="text-link" href="/play">
        <ArrowRight size={17} />
        إلى الساحة
      </Link>
      <header>
        <span className="eyebrow">من فكرة إلى أثر</span>
        <h1>مساحة أفكارك.</h1>
        <p>دفتر مشاريع وأسئلة، واختيار لموضوع تحبّه.</p>
      </header>
      <div className="play-local-banner">
        <HeartHandshake size={24} />
        <p>
          هذه مساحة شخصية على جهازك. لا تُرسل المشاركات إلى المدرسة ولا تُعرض
          للآخرين. يمكنك تنزيل مسودتك ومشاركتها بنفسك مع المعلم. لوحة المدرسة
          المشتركة تنتظر تفعيل الإرسال والمراجعة.
        </p>
      </div>
      <section className="play-ideas">
        <h2>شرارة لمشروعك القادم</h2>
        <p>أفكار إلهام، وليست مشاريع منشورة باسم طلاب.</p>
        <div>
          {[
            [
              "مدينة أرحب",
              "ارسم حيًا يوازن بين المساحات الخضراء والتعلّم والنشاط، وفسّر اختياراتك.",
            ],
            [
              "الأرقام في الملعب",
              "استخدم بيانات مباراة خيالية وارسم مخططًا يقارن المحاولات بالنجاح.",
            ],
            [
              "حكاية تغيّر موقفًا",
              "اكتب قصة قصيرة يظهر فيها أثر الاعتذار أو التعاون، ثم ناقش نهايتها.",
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <Lightbulb size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="play-community-forms">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (project.trim().length >= 20 && projectCount < 6) {
              saveDraft(`project-${Date.now()}`, project.trim());
              setProject("");
              setNotice("حُفظت فكرة المشروع على جهازك. لم تُرسل أو تُنشر.");
            }
          }}
        >
          <Lightbulb size={28} />
          <h2>مشروعي القادم</h2>
          <label className="play-field">
            ما الفكرة؟ ماذا تحتاج؟ وكيف ستختبرها؟
            <textarea
              value={project}
              onChange={(e) => setProject(e.target.value)}
              minLength={20}
              maxLength={2000}
              required
              rows={5}
            />
          </label>
          <button
            className="btn"
            disabled={project.trim().length < 20 || projectCount >= 6}
          >
            احفظ فكرة المشروع
          </button>
          <small>{projectCount} / 6 مسودات مشاريع</small>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (question.trim().length >= 10 && questionCount < 10) {
              saveDraft(`question-${Date.now()}`, question.trim());
              setQuestion("");
              setNotice("حُفظ سؤالك على جهازك، ولم يُرسل إلى المدرسة.");
            }
          }}
        >
          <MessageCircle size={28} />
          <h2>سؤال يستحق البحث</h2>
          <label className="play-field">
            ما الذي يثير فضولك؟
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              minLength={10}
              maxLength={1000}
              required
              rows={5}
            />
          </label>
          <button
            className="btn"
            disabled={question.trim().length < 10 || questionCount >= 10}
          >
            احفظ سؤالي
          </button>
          <small>{questionCount} / 10 أسئلة</small>
        </form>
      </div>
      <p className="play-save-status" role="status">
        {notice}
      </p>
      <section className="play-local-projects">
        <h2>مسوداتي وأسئلتي</h2>
        {entries.length === 0 ? (
          <p>ستظهر هنا الأفكار التي تحفظها.</p>
        ) : (
          <div>
            {entries.map(([id, text]) => (
              <article key={id}>
                <span className="eyebrow">
                  {id.startsWith("project-") ? "مسودة مشروع" : "سؤالي"} / محفوظ
                  محليًا
                </span>
                <p>{text}</p>
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => downloadText(`afaq-${id}.txt`, text)}
                  >
                    <Download size={16} />
                    تنزيل
                  </button>
                  <button
                    className="btn ghost"
                    onClick={() => saveDraft(id, "")}
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="play-poll">
        <span className="eyebrow">موضوع تتمنى استكشافه</span>
        <h2>أي عالم يشدّ فضولك؟</h2>
        <div>
          {[
            ["science", "تجارب علمية"],
            ["stories", "قصص وكتابة"],
            ["sports", "رياضة وأرقام"],
            ["values", "قيم وحياة"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={progress.vote === id}
              className={progress.vote === id ? "active" : ""}
              onClick={() => vote(id)}
            >
              {label}
              {progress.vote === id && <Check size={18} />}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          {progress.vote
            ? "حُفظ اختيارك الشخصي. يمكنك تغييره."
            : "اختر ما تحب استكشافه."}{" "}
          لا توجد نتائج جماعية أو إحصاءات طلاب في هذه النسخة.
        </p>
      </section>
      <StorageNotice />
    </div>
  );
}
