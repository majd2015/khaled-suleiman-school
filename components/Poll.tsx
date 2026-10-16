"use client";

import { useActionState, useEffect, useState } from "react";
import { castVote, type FormState } from "@/app/actions";

export type PollResult = { option_id: string; label: string; votes: number };

// مع قاعدة البيانات: تصويت حقيقي ونتائج من الجميع. بدونها: استطلاع تجريبي على هذا المتصفح فقط.
export default function Poll(
  props:
    | { id: string; question: string; results: PollResult[]; voted: boolean }
    | { id: string; question: string; options: string[] },
) {
  return "results" in props ? <ServerPoll {...props} /> : <LocalPoll {...props} />;
}

function ServerPoll({ id, question, results, voted }: { id: string; question: string; results: PollResult[]; voted: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(castVote, null);
  const showResults = voted || state?.ok;
  const total = results.reduce((s, r) => s + Number(r.votes), 0) || 1;

  return (
    <div className="card">
      <h3>{question}</h3>
      {showResults ? (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {state?.message && <p role="status">{state.message}</p>}
          {results.map((r) => {
            const pct = Math.round((Number(r.votes) / total) * 100);
            return (
              <div key={r.option_id}>
                <div className="meta"><strong style={{ color: "var(--text)" }}>{r.label}</strong><span>{pct}%</span></div>
                <div className="bar"><span style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      ) : (
        <form action={action} style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <input type="hidden" name="poll" value={id} />
          {results.map((r) => (
            <button key={r.option_id} className="btn ghost" name="option" value={r.option_id} disabled={pending}>{r.label}</button>
          ))}
          {state && !state.ok && <p className="badge urgent">{state.message}</p>}
        </form>
      )}
    </div>
  );
}

function LocalPoll({ id, question, options }: { id: string; question: string; options: string[] }) {
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
