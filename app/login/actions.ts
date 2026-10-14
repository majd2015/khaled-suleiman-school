"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, isDbConfigured } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_DAYS, signSession } from "@/lib/session";

// حد بسيط لمحاولات الدخول لكل عنوان IP (في ذاكرة الخادم)
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export async function signIn(_: string | null, form: FormData): Promise<string | null> {
  if (!isDbConfigured() || !process.env.SESSION_SECRET) return "قاعدة البيانات غير مربوطة بعد.";
  const ip = ((await headers()).get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.until > now && a.count >= MAX_ATTEMPTS) return "محاولات كثيرة. حاول بعد ربع ساعة.";

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = email ? await db().user.findUnique({ where: { email } }) : null;
  const ok = !!user && user.active && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    attempts.set(ip, { count: (a && a.until > now ? a.count : 0) + 1, until: now + WINDOW_MS });
    return "البريد أو كلمة السر غير صحيحة.";
  }
  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await signSession(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
