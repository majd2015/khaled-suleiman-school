"use client";

import { useEffect, useState } from "react";

// تصويت تجريبي يُحفظ على الجهاز. تجميع الأصوات من الجميع يُربط بقاعدة البيانات لاحقًا.
export default function Poll({ id, question, options }: { id: string; question: string; options: string[] }) {
  const key = `poll:${id}`;
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => { try { setChoice(localStorage.getItem(key)); } catch {} }, [key]);
  const vote = (o: string) => { setChoice(o); try { localStorage.setItem(key, o); } catch {} };
  return (
    <div className="card">
      <h3>{question}</h3>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {options.map((o) => (
          <button key={o} className={choice === o ? "btn" : "btn ghost"} onClick={() => vote(o)} disabled={!!choice}>{o}</button>
        ))}
      </div>
      {choice && <p style={{ marginTop: 12 }}>شكرًا، سُجّل صوتك: {choice}</p>}
    </div>
  );
}
