"use client";

import { useActionState, useState } from "react";
import { submitSubmission, type FormState } from "@/app/actions";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
};

type Props = {
  kind: "debate" | "kind_word" | "reading";
  fields: Field[];
  enabled: boolean;
  submitLabel?: string;
};

// مع قاعدة البيانات: تُحفظ المشاركة "بانتظار المراجعة" ولا تظهر قبل موافقة معلّم.
// بدونها: معاينة صادقة على الصفحة فقط، دون الادعاء بأنها أُرسلت.
export default function SubmitForm(props: Props) {
  return props.enabled ? <LiveForm {...props} /> : <PreviewForm {...props} />;
}

function FieldInputs({ fields }: { fields: Field[] }) {
  return (
    <>
      {fields.map((f) => (
        <label key={f.name} htmlFor={"participation-" + f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea id={"participation-" + f.name} name={f.name} rows={4} required maxLength={2000} />
          ) : f.type === "select" ? (
            <select id={"participation-" + f.name} name={f.name}>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input id={"participation-" + f.name} name={f.name} required maxLength={200} />
          )}
        </label>
      ))}
    </>
  );
}

function LiveForm({ kind, fields, submitLabel = "إرسال للمراجعة" }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitSubmission, null);
  if (state?.ok) return <p className="card form-status" role="status">{state.message}</p>;
  return (
    <form className="stack card" action={action}>
      <input type="hidden" name="kind" value={kind} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="field-note">تصل مشاركتك إلى معلّم يراجعها قبل أن تظهر في الموقع.</p>
      <FieldInputs fields={fields} />
      <label htmlFor="participation-authorName">
        اسمي (اختياري)
        <input id="participation-authorName" name="authorName" maxLength={80} />
      </label>
      <label style={{ fontWeight: 400 }}>
        <input type="checkbox" name="showName" /> أوافق على نشر اسمي مع المشاركة
      </label>
      {state && !state.ok && <p className="badge urgent">{state.message}</p>}
      <button className="btn" type="submit" disabled={pending}>{pending ? "جارٍ الإرسال..." : submitLabel}</button>
    </form>
  );
}

function PreviewForm({ fields }: Props) {
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  return (
    <form
      className="stack card"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setDraft(Object.fromEntries(fields.map((f) => [f.name, String(data.get(f.name) || "")])));
      }}
    >
      <p className="field-note">
        مساحة لتجربة كتابة المشاركة. الإرسال إلى المدرسة غير مفعّل بعد؛ لا تُرسل
        هذه البيانات ولا تُحفظ خارج الصفحة.
      </p>
      <FieldInputs fields={fields} />
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
