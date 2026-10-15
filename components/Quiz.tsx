"use client";

import { useState } from "react";

// يُفحص الجواب على جهاز الطالب فقط، ولا يُرسل لأي مكان.
export default function Quiz({ q }: { q: { text: string; options: string[]; correctIndex: number; explanation: string } }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="card quiz">
      <h3>سؤال للتفكير</h3>
      <p>{q.text}</p>
      {q.options.map((o, i) => (
        <button
          key={i}
          className={`btn ghost${picked !== null && i === q.correctIndex ? " right" : ""}${picked === i && i !== q.correctIndex ? " wrong" : ""}`}
          onClick={() => setPicked(i)}
          aria-pressed={picked === i}
        >
          {o}
        </button>
      ))}
      {picked !== null && (
        <p role="status"><strong>{picked === q.correctIndex ? "إجابة موفّقة. " : "ليس تمامًا. "}</strong>{q.explanation}</p>
      )}
    </div>
  );
}
