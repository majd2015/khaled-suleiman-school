"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(signIn, null);
  return (
    <form className="stack card" action={action}>
      <label>البريد الإلكتروني<input name="email" type="email" required dir="ltr" autoComplete="email" /></label>
      <label>كلمة السر<input name="password" type="password" required dir="ltr" autoComplete="current-password" /></label>
      {error && <p className="badge urgent">{error}</p>}
      <button className="btn" disabled={pending}>{pending ? "جارٍ الدخول..." : "دخول"}</button>
    </form>
  );
}
