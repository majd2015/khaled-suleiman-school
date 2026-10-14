"use client";

import { useState } from "react";

type Field = { name: string; label: string; type?: "text" | "textarea" | "select"; options?: string[] };

// نموذج مشاركة عام. الإرسال الفعلي إلى قاعدة بيانات للمراجعة يُربط في المرحلة القادمة.
export default function SubmitForm({ fields, submitLabel = "إرسال للمراجعة" }: { fields: Field[]; submitLabel?: string }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="card">شكرًا! وصلت مشاركتك وسيراجعها معلّم قبل نشرها.</p>;
  return (
    <form className="stack card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea name={f.name} rows={4} required />
          ) : f.type === "select" ? (
            <select name={f.name}>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>
          ) : (
            <input name={f.name} required />
          )}
        </label>
      ))}
      <label style={{ fontWeight: 400 }}>
        <input type="checkbox" name="showName" /> أوافق على نشر اسمي مع المشاركة
      </label>
      <button className="btn" type="submit">{submitLabel}</button>
    </form>
  );
}
