"use client";

import { useActionState } from "react";
import { sendContact, type FormState } from "@/app/actions";

export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, null);
  return (
    <form className="card stack" action={action}>
      <h3>أرسل رسالة</h3>
      {!enabled ? (
        <p>إرسال الرسائل من الموقع غير مفعّل بعد. تواصلوا معنا عبر الهاتف أو البريد.</p>
      ) : state?.ok ? (
        <p>{state.message}</p>
      ) : (
        <>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          <label>الاسم<input name="name" required maxLength={100} /></label>
          <label>رقم الهاتف<input name="phone" maxLength={30} inputMode="tel" /></label>
          <label>الرسالة<textarea name="message" rows={4} required maxLength={3000} /></label>
          {state && !state.ok && <p className="badge urgent">{state.message}</p>}
          <button className="btn" type="submit" disabled={pending}>{pending ? "جارٍ الإرسال..." : "إرسال"}</button>
        </>
      )}
    </form>
  );
}
