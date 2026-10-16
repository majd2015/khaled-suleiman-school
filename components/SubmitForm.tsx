"use client";
import { useState } from "react";
type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
};
// No backend exists yet: preview the draft honestly without claiming delivery.
export default function SubmitForm({
  fields,
}: {
  fields: Field[];
  submitLabel?: string;
}) {
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  return (
    <form
      className="stack card"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setDraft(
          Object.fromEntries(
            fields.map((f) => [f.name, String(data.get(f.name) || "")]),
          ),
        );
      }}
    >
      <p className="field-note">
        مساحة لتجربة كتابة المشاركة. الإرسال إلى المدرسة غير مفعّل بعد؛ لا تُرسل
        هذه البيانات ولا تُحفظ خارج الصفحة.
      </p>
      {fields.map((f) => (
        <label key={f.name} htmlFor={"participation-" + f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea
              id={"participation-" + f.name}
              name={f.name}
              rows={4}
              required
              maxLength={2000}
            />
          ) : f.type === "select" ? (
            <select id={"participation-" + f.name} name={f.name}>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              id={"participation-" + f.name}
              name={f.name}
              required
              maxLength={150}
            />
          )}
        </label>
      ))}
      <button className="btn" type="submit">
        معاينة مشاركتي
      </button>
      {draft && (
        <div className="form-status" role="status">
          <strong>هذه معاينة فقط؛ لم تُرسل المشاركة.</strong>
          {fields.map((f) => (
            <p key={f.name}>
              <b>{f.label}: </b>
              {draft[f.name]}
            </p>
          ))}
        </div>
      )}
    </form>
  );
}
