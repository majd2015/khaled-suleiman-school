"use client";

import { useActionState } from "react";
import { castVote, type FormState } from "@/app/actions";

export type PollResult = { option_id: string; label: string; votes: number };

export default function Poll({
  id,
  question,
  results,
  voted,
}: {
  id: string;
  question: string;
  results: PollResult[];
  voted: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(castVote, null);
  const showResults = voted || state?.ok;
  const total = results.reduce((s, r) => s + Number(r.votes), 0) || 1;

  return (
    <div className="card">
      <h3>{question}</h3>
      {showResults ? (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {state?.message && <p>{state.message}</p>}
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
        <form action={action} style={{ display: "grid", gap: 8, marginTop: 12 }}>
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
