"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Compass,
  Check,
  Sparkles,
  Download,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { games } from "@/content/games";
import { StorageNotice, useProgress, downloadText } from "./Progress";
export default function Passport() {
  const { progress, ready, reset } = useProgress(),
    [confirm, setConfirm] = useState(false);
  const done = games.filter((g) => progress.completed[g.slug]),
    reading = Object.keys(progress.completed).filter((k) =>
      k.startsWith("reading:"),
    );
  return (
    <div className="container play-passport">
      <Link className="text-link" href="/play">
        <ArrowRight size={17} />
        إلى ساحة التحدّيات
      </Link>
      <header className="play-passport-heading">
        <span className="play-complete-symbol">
          <Compass size={40} />
        </span>
        <span className="eyebrow">خطوة بعد خطوة</span>
        <h1>جواز تعلّمي.</h1>
        <p>كل ختم هنا وراءه محاولة، وفكرة، وشيء تعلّمته.</p>
      </header>
      <div className="play-passport-summary">
        <div>
          <strong>
            {done.length}
            <small> / {games.length}</small>
          </strong>
          <span>تجارب مكتملة</span>
        </div>
        <div>
          <strong>
            {new Set(done.map((g) => g.category)).size}
            <small> / 5</small>
          </strong>
          <span>عوالم استكشفتها</span>
        </div>
        <div>
          <strong>
            {reading.length}
            <small> / 44</small>
          </strong>
          <span>تحدّيات مقالات مكتملة</span>
        </div>
      </div>
      {ready && done.length === 0 && (
        <p className="play-empty-message">
          جوازك ينتظر أول مغامرة. اختر أي تجربة؛ لا يلزم ترتيب محدد.
        </p>
      )}
      <div className="play-stamps">
        {games.map((g, i) => {
          const completed = progress.completed[g.slug];
          return (
            <Link
              key={g.slug}
              href={`/play/${g.slug}`}
              className={`play-stamp play-tone-${g.color} ${completed ? "earned" : ""}`}
            >
              <span className="play-stamp-icon">
                {completed ? <Check size={27} /> : <Sparkles size={24} />}
              </span>
              <small>المحطة {String(i + 1).padStart(2, "0")}</small>
              <h2>{g.title}</h2>
              <p>
                {completed
                  ? "أنجزتها — يمكنك تجربتها من جديد"
                  : "مساحة لاكتشاف جديد"}
              </p>
            </Link>
          );
        })}
      </div>
      <div className="play-passport-actions">
        <button
          className="btn ghost"
          disabled={!ready}
          onClick={() =>
            downloadText(
              "afaq-learning-passport.json",
              JSON.stringify(progress, null, 2),
              "application/json",
            )
          }
        >
          <Download size={18} />
          تنزيل نسخة من جوازي ومسوداتي
        </button>
        <button className="btn ghost" onClick={() => setConfirm(true)}>
          <Trash2 size={18} />
          مسح بيانات ساحة التحدّيات
        </button>
      </div>
      {confirm && (
        <div className="play-feedback" role="alert">
          <strong>
            سيُمسح تقدّم الألعاب والمسودات والاختيار المحفوظ من هذا المتصفح.
          </strong>
          <p>
            المقالات المحفوظة وبقية أقسام الموقع لن تتأثر. يمكنك تنزيل نسخة قبل
            المسح.
          </p>
          <div className="actions">
            <button
              className="btn"
              onClick={() => {
                reset();
                setConfirm(false);
              }}
            >
              نعم، امسح بيانات الساحة
            </button>
            <button className="btn ghost" onClick={() => setConfirm(false)}>
              احتفظ بها
            </button>
          </div>
        </div>
      )}
      <StorageNotice />
    </div>
  );
}
