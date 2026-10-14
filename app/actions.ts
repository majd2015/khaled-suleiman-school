"use server";

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isDbConfigured, supabasePublic } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

const NOT_READY: FormState = { ok: false, message: "هذه الخدمة غير مفعّلة بعد. جرّب لاحقًا." };
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);
// حقل مخفي لا يملؤه إلا الروبوتات
const isBot = (f: FormData) => clean(f.get("website"), 10) !== "";

const KINDS = ["debate", "kind_word", "reading"] as const;
const RESERVED = new Set(["website", "showName", "authorName", "kind"]);

export async function submitSubmission(_: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return NOT_READY;
  if (isBot(form)) return { ok: true, message: "شكرًا!" };
  const kind = clean(form.get("kind"), 20) as (typeof KINDS)[number];
  if (!KINDS.includes(kind)) return { ok: false, message: "نوع المشاركة غير معروف." };

  const content: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (RESERVED.has(key) || key.startsWith("$")) continue;
    const v = clean(value, 2000);
    if (!v) return { ok: false, message: "الرجاء تعبئة كل الحقول." };
    content[key] = v;
  }
  const showName = form.get("showName") === "on";
  const authorName = clean(form.get("authorName"), 80);

  const { error } = await supabasePublic().from("submissions").insert({
    kind,
    content,
    show_name: showName && authorName !== "",
    author_name: authorName || null,
  });
  if (error) return { ok: false, message: "تعذّر الإرسال، حاول مرة أخرى." };
  return { ok: true, message: "شكرًا! وصلت مشاركتك وسيراجعها معلّم قبل نشرها." };
}

export async function sendContact(_: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return NOT_READY;
  if (isBot(form)) return { ok: true, message: "شكرًا!" };
  const name = clean(form.get("name"), 100);
  const message = clean(form.get("message"), 3000);
  if (!name || !message) return { ok: false, message: "الرجاء كتابة الاسم والرسالة." };
  const { error } = await supabasePublic()
    .from("contact_messages")
    .insert({ name, message, phone: clean(form.get("phone"), 30) || null });
  if (error) return { ok: false, message: "تعذّر الإرسال، حاول مرة أخرى." };
  return { ok: true, message: "شكرًا، وصلت رسالتك وسنعود إليك." };
}

export async function castVote(_: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return NOT_READY;
  const pollId = clean(form.get("poll"), 40);
  const optionId = clean(form.get("option"), 40);
  if (!pollId || !optionId) return { ok: false, message: "اختر إجابة." };

  // بصمة مجهولة: لا نخزّن عنوان IP نفسه، بل ناتج تشفير لا يمكن عكسه
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const voterHash = createHash("sha256")
    .update(`${pollId}|${ip}|${h.get("user-agent") ?? ""}|${process.env.VOTE_SALT ?? "school"}`)
    .digest("hex");

  const { error } = await supabasePublic()
    .from("poll_votes")
    .insert({ poll_id: pollId, option_id: optionId, voter_hash: voterHash });
  (await cookies()).set(`voted-${pollId}`, "1", { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax" });
  revalidatePath("/participate/vote");
  if (error?.code === "23505") return { ok: true, message: "سبق أن صوّتّ في هذا الاستطلاع." };
  if (error) return { ok: false, message: "تعذّر تسجيل الصوت." };
  return { ok: true, message: "شكرًا، سُجّل صوتك." };
}
