"use server";

import { redirect } from "next/navigation";
import { isDbConfigured, supabaseServer } from "@/lib/supabase/server";

export async function signIn(_: string | null, form: FormData): Promise<string | null> {
  if (!isDbConfigured()) return "قاعدة البيانات غير مربوطة بعد.";
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) return "البريد أو كلمة السر غير صحيحة.";
  redirect("/admin");
}

export async function signOut() {
  if (isDbConfigured()) await (await supabaseServer()).auth.signOut();
  redirect("/login");
}
