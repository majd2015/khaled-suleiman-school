"use client";
import { useRef, useState } from "react";
type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
};
const limits = { text: [2, 150], textarea: [10, 2000] } as const;
// No backend exists yet: preview the draft honestly without claiming delivery.
export default function SubmitForm({
  fields,
}: {
  fields: Field[];
  submitLabel?: string;
}) {
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null);
  const idOf = (f: Field) => "participation-" + f.name;
  function check(f: Field, raw: string) {
    if (f.type === "select") return "";
    const [min, max] = limits[f.type === "textarea" ? "textarea" : "text"];
    const v = raw.trim();
    if (!v) return "هذا الحقل مطلوب.";
    if (v.length < min) return `اكتب ${min} أحرف على الأقل.`;
    if (v.length > max) return `الحد الأقصى ${max} حرف.`;
    return "";
  }
  function change(f: Field, v: string) {
    setValues((s) => ({ ...s, [f.name]: v }));
    setDraft(null);
    if (errors[f.name]) setErrors((s) => ({ ...s, [f.name]: check(f, v) }));
  }
  return (
    <form
      ref={form}
      className="stack card"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const read = Object.fromEntries(
          fields.map((f) => [f.name, String(data.get(f.name) || "")]),
        );
        const found = Object.fromEntries(
          fields.map((f) => [f.name, check(f, read[f.name])]).filter(([, m]) => m),
        );
        setErrors(found);
        const first = fields.find((f) => found[f.name]);
        if (first) {
          setDraft(null);
          form.current?.querySelector<HTMLElement>("#" + idOf(first))?.focus();
          return;
        }
        setDraft(
          Object.fromEntries(fields.map((f) => [f.name, read[f.name].trim()])),
        );
      }}
    >
      <p className="field-note">
        مساحة لتجربة كتابة المشاركة. الإرسال إلى المدرسة غير مفعّل بعد؛ لا تُرسل
        هذه البيانات ولا تُحفظ خارج الصفحة.
      </p>
      {fields.map((f) => {
        const id = idOf(f),
          err = errors[f.name],
          max = f.type === "textarea" ? limits.textarea[1] : limits.text[1];
        const common = {
          id,
          name: f.name,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? id + "-error" : undefined,
        };
        return (
          <label key={f.name} htmlFor={id}>
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                {...common}
                rows={4}
                required
                maxLength={max}
                onChange={(e) => change(f, e.target.value)}
                onBlur={(e) =>
                  e.target.value &&
                  setErrors((s) => ({ ...s, [f.name]: check(f, e.target.value) }))
                }
              />
            ) : f.type === "select" ? (
              <select {...common} onChange={() => setDraft(null)}>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                required
                maxLength={max}
                onChange={(e) => change(f, e.target.value)}
                onBlur={(e) =>
                  e.target.value &&
                  setErrors((s) => ({ ...s, [f.name]: check(f, e.target.value) }))
                }
              />
            )}
            {f.type === "textarea" && (
              <small className="char-count" aria-hidden="true">
                {(values[f.name] || "").length} من {max} حرف
              </small>
            )}
            {err && (
              <small className="field-error" id={id + "-error"}>
                {err}
              </small>
            )}
          </label>
        );
      })}
      <button className="btn" type="submit">
        معاينة مشاركتي
      </button>
      {Object.keys(errors).some((k) => errors[k]) && (
        <p className="form-status error" role="alert">
          راجع الحقول المحددة قبل المعاينة.
        </p>
      )}
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
