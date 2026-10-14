"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, type Role } from "@/lib/auth";
import { isAllowedImage, saveImage } from "@/lib/media";
import { db } from "@/lib/prisma";
import { publishEverywhere } from "@/lib/social";

const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);
const grades = (f: FormData) => f.getAll("grades").map(Number).filter((g) => [7, 8, 9].includes(g));
const date = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v) : null);
const today = () => new Date(new Date().toISOString().slice(0, 10));
const refreshSite = () => revalidatePath("/", "layout");

const CATEGORIES = ["تعليم", "احتفالات", "رحلات", "مجتمع"];
const EVENT_TYPES = ["امتحان", "نشاط", "عطلة", "عام"];

// ========== الأخبار ==========

export async function saveNews(form: FormData) {
  const { user } = await requireRole(["admin", "editor"]);
  const id = str(form, "id", 40);
  const back = `/admin/news/${id || "new"}`;
  const title = str(form, "title", 200);
  if (!title) redirect(`${back}?e=title`);

  const data = {
    title,
    excerpt: str(form, "excerpt", 300),
    body: str(form, "body", 20000),
    category: CATEGORIES.includes(str(form, "category", 20)) ? str(form, "category", 20) : "تعليم",
    grades: grades(form),
    status: form.get("publish") === "on" ? ("published" as const) : ("draft" as const),
    publishedAt: date(str(form, "published_at", 10)) ?? today(),
    imageConsent: form.get("image_consent") === "on",
  } as Record<string, unknown>;

  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    if (!isAllowedImage(image)) redirect(`${back}?e=image`);
    data.imageUrl = await saveImage(image);
  }
  if (form.get("remove_image") === "on") data.imageUrl = null;

  const saved = id
    ? await db().news.update({ where: { id }, data })
    : await db().news.create({
        data: {
          ...(data as { title: string }),
          slug: `${(data.publishedAt as Date).toISOString().slice(0, 10)}-${randomUUID().slice(0, 6)}`,
          authorId: user.id,
        },
      });

  // النشر على فيسبوك وإنستجرام مرة واحدة فقط لكل خبر منشور
  const wantFb = form.get("to_facebook") === "on" && !saved.facebookPostId;
  const wantIg = form.get("to_instagram") === "on" && !saved.instagramMediaId;
  let social = "";
  if (saved.status === "published" && (wantFb || wantIg)) {
    const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
    const abs = (u: string | null) => (u && u.startsWith("/") ? (siteUrl ? siteUrl + u : undefined) : u ?? undefined);
    const results = await publishEverywhere(
      {
        message: [saved.title, saved.excerpt].filter(Boolean).join("\n\n"),
        link: siteUrl ? `${siteUrl}/news/${saved.slug}` : undefined,
        imageUrl: abs(saved.imageUrl),
      },
      { facebook: wantFb, instagram: wantIg },
    );
    await db().socialPost.createMany({
      data: results.map((r) => ({ newsId: saved.id, platform: r.platform, ok: r.ok, externalId: r.id ?? null, error: r.error ?? null })),
    });
    const fb = results.find((r) => r.platform === "facebook" && r.ok);
    const ig = results.find((r) => r.platform === "instagram" && r.ok);
    if (fb || ig) {
      await db().news.update({
        where: { id: saved.id },
        data: { ...(fb ? { facebookPostId: fb.id } : {}), ...(ig ? { instagramMediaId: ig.id } : {}) },
      });
    }
    social = "&social=" + results.map((r) => `${r.platform}:${r.ok ? "ok" : "fail"}`).join(",");
  }

  refreshSite();
  redirect(`/admin/news/${saved.id}?saved=1${social}`);
}

export async function deleteNews(form: FormData) {
  await requireRole(["admin", "editor"]);
  await db().news.deleteMany({ where: { id: str(form, "id", 40) } });
  refreshSite();
  redirect("/admin/news");
}

// ========== الإعلانات ==========

export async function saveAnnouncement(form: FormData) {
  await requireRole(["admin", "editor"]);
  const title = str(form, "title", 200);
  if (title) {
    await db().announcement.create({
      data: {
        title,
        body: str(form, "body", 2000),
        urgent: form.get("urgent") === "on",
        grades: grades(form),
        date: date(str(form, "date", 10)) ?? today(),
        expiresOn: date(str(form, "expires_on", 10)),
      },
    });
    refreshSite();
  }
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(form: FormData) {
  await requireRole(["admin", "editor"]);
  await db().announcement.deleteMany({ where: { id: str(form, "id", 40) } });
  refreshSite();
  redirect("/admin/announcements");
}

// ========== الرزنامة ==========

export async function saveEvent(form: FormData) {
  await requireRole(["admin", "editor"]);
  const title = str(form, "title", 200);
  const d = date(str(form, "date", 10));
  const type = str(form, "type", 10);
  if (title && d && EVENT_TYPES.includes(type)) {
    await db().event.create({
      data: { title, date: d, type, confirmed: form.get("confirmed") === "on", grades: grades(form) },
    });
    refreshSite();
  }
  redirect("/admin/events");
}

export async function deleteEvent(form: FormData) {
  await requireRole(["admin", "editor"]);
  await db().event.deleteMany({ where: { id: str(form, "id", 40) } });
  refreshSite();
  redirect("/admin/events");
}

// ========== مراجعة مشاركات الطلاب ==========

export async function reviewSubmission(form: FormData) {
  const { user } = await requireRole(["admin", "editor", "teacher"]);
  const status = str(form, "status", 10);
  if (status === "approved" || status === "rejected") {
    await db().submission.updateMany({
      where: { id: str(form, "id", 40) },
      data: { status, reviewedById: user.id, reviewedAt: new Date() },
    });
    revalidatePath("/participate", "layout");
  }
  redirect(`/admin/submissions?s=${str(form, "from", 10) || "pending"}`);
}

// ========== الرسائل ==========

export async function markMessage(form: FormData) {
  await requireRole(["admin", "editor"]);
  await db().contactMessage.updateMany({ where: { id: str(form, "id", 40) }, data: { handled: form.get("handled") === "1" } });
  redirect("/admin/messages");
}

// ========== التصويت ==========

export async function createPoll(form: FormData) {
  await requireRole(["admin", "editor"]);
  const question = str(form, "question", 300);
  const options = str(form, "options", 2000).split("\n").map((o) => o.trim()).filter(Boolean).slice(0, 8);
  if (question && options.length >= 2) {
    await db().poll.create({
      data: { question, options: { create: options.map((label, position) => ({ label, position })) } },
    });
    revalidatePath("/participate/vote");
  }
  redirect("/admin/polls");
}

export async function togglePoll(form: FormData) {
  await requireRole(["admin", "editor"]);
  await db().poll.updateMany({ where: { id: str(form, "id", 40) }, data: { active: form.get("active") === "1" } });
  revalidatePath("/participate/vote");
  redirect("/admin/polls");
}

// ========== المستخدمون (للمدير فقط) ==========

const ROLES: Role[] = ["admin", "editor", "teacher"];
const MIN_PASSWORD = 10;

export async function createUser(form: FormData) {
  await requireRole(["admin"]);
  const email = str(form, "email", 200).toLowerCase();
  const password = String(form.get("password") ?? "");
  const role = str(form, "role", 10) as Role;
  if (!/^\S+@\S+\.\S+$/.test(email) || !ROLES.includes(role)) redirect("/admin/users?e=input");
  if (password.length < MIN_PASSWORD) redirect("/admin/users?e=password");
  if (await db().user.findUnique({ where: { email } })) redirect("/admin/users?e=exists");
  await db().user.create({
    data: { email, name: str(form, "name", 100), role, passwordHash: await bcrypt.hash(password, 12) },
  });
  redirect("/admin/users?ok=1");
}

export async function updateUser(form: FormData) {
  const { user: me } = await requireRole(["admin"]);
  const id = str(form, "id", 40);
  const role = str(form, "role", 10) as Role;
  const active = form.get("active") === "on";
  const password = String(form.get("password") ?? "");
  // المدير لا يستطيع إزالة صلاحيته أو إيقاف حسابه بنفسه، حتى لا يبقى الموقع بلا مدير
  if (id === me.id && (role !== "admin" || !active)) redirect("/admin/users?e=self");
  if (password && password.length < MIN_PASSWORD) redirect("/admin/users?e=password");
  await db().user.update({
    where: { id },
    data: {
      ...(ROLES.includes(role) ? { role } : {}),
      active,
      ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
    },
  });
  redirect("/admin/users?ok=1");
}
