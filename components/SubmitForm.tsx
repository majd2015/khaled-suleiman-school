"use client";

import { useActionState } from "react";
import { submitSubmission, type FormState } from "@/app/actions";

type Field = { name: string; label: string; type?: "text" | "textarea" | "select"; options?: string[] };

// نموذج مشاركة طالب: يُحفظ بحالة "بانتظار المراجعة" ولا يظهر قبل موافقة معلّم.
export default function SubmitForm({
  kind,
  fields,
  enabled,
  submitLabel = "إرسال للمراجعة",
}: {
  kind: "debate" | "kind_word" | "reading";
  fields: Field[];
  enabled: boolean;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitSubmission, null);
  if (!enabled) return <p className="card">استقبال المشاركات غير مفعّل بعد. سيُفتح قريبًا.</p>;
  if (state?.ok) return <p className="card">{state.message}</p>;
  return (
    <form className="stack card" action={action}>
      <input type="hidden" name="kind" value={kind} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea name={f.name} rows={4} required maxLength={2000} />
          ) : f.type === "select" ? (
            <select name={f.name}>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>
          ) : (
            <input name={f.name} required maxLength={200} />
          )}
        </label>
      ))}
      <label>
        اسمي (اختياري)
        <input name="authorName" maxLength={80} />
      </label>
      <label style={{ fontWeight: 400 }}>
        <input type="checkbox" name="showName" /> أوافق على نشر اسمي مع المشاركة
      </label>
      {state && !state.ok && <p className="badge urgent">{state.message}</p>}
      <button className="btn" type="submit" disabled={pending}>{pending ? "جارٍ الإرسال..." : submitLabel}</button>
    </form>
  );
}
