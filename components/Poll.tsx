"use client";
import { useEffect, useState } from "react";
export default function Poll({
  id,
  question,
  options,
}: {
  id: string;
  question: string;
  options: string[];
}) {
  const key = "poll:" + id;
  const [choice, setChoice] = useState<string | null>(null),
    [temporary, setTemporary] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      setChoice(saved && options.includes(saved) ? saved : null);
    } catch {
      setTemporary(true);
    }
  }, [key, options]);
  function vote(option: string) {
    setChoice(option);
    try {
      localStorage.setItem(key, option);
    } catch {
      setTemporary(true);
    }
  }
  return (
    <div className="card">
      <h3>{question}</h3>
      <p className="field-note">
        استطلاع تجريبي على هذا المتصفح فقط؛ لا تُجمع الأصوات ولا تُرسل إلى
        المدرسة.
      </p>
      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {options.map((o) => (
          <button
            key={o}
            className={choice === o ? "btn" : "btn ghost"}
            type="button"
            aria-pressed={choice === o}
            onClick={() => vote(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {choice && (
        <p style={{ marginTop: 18 }} role="status">
          {temporary
            ? "اختيارك محفوظ مؤقتًا في هذه الصفحة: "
            : "اختيارك محفوظ في هذا المتصفح: "}
          {choice}. يمكنك تغييره.
        </p>
      )}
    </div>
  );
}
