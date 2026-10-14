"use client";

import { useEffect, useState } from "react";

// التقدّم يُحفظ على جهاز الطالب فقط (مثل موقع المشرفة)، بدون نقاط أو تسجيل.
export default function ChallengeSolver({ slug, hints, answer }: { slug: string; hints: string[]; answer: string }) {
  const key = `challenge:${slug}`;
  const [shownHints, setShownHints] = useState(0);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    try { setDone(localStorage.getItem(key) === "done"); } catch {}
  }, [key]);

  const markDone = () => {
    setDone(true);
    try { localStorage.setItem(key, "done"); } catch {}
  };

  return (
    <div>
      {hints.slice(0, shownHints).map((h, i) => (
        <p key={i}>💡 تلميح {i + 1}: {h}</p>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {shownHints < hints.length && (
          <button className="btn ghost" onClick={() => setShownHints(shownHints + 1)}>أظهر تلميحًا</button>
        )}
        <button className="btn ghost" onClick={() => setReveal(true)}>أظهر الحل</button>
        <button className="btn" onClick={markDone} disabled={done}>{done ? "✓ أنجزته" : "أنجزت التحدّي"}</button>
      </div>
      {reveal && <p style={{ marginTop: 12 }}><strong>الحل:</strong> {answer}</p>}
    </div>
  );
}
