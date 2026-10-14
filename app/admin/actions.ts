"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { publishEverywhere } from "@/lib/social";

const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);
const grades = (f: FormData) => f.getAll("grades").map(Number).filter((g) => [7, 8, 9].includes(g));
const refreshSite = () => revalidatePath("/", "layout");

const MAX_IMAGE = 5 * 1024 * 1024;

// ========== الأخبار ==========

export async function saveNews(form: FormData) {
  const { supabase, user } = await requireRole(["admin", "editor"]);
  const id = str(form, "id", 40);
  const title = str(form, "title", 200);
  if (!title) redirect(`/admin/news/${id || "new"}?e=title`);

  const row: Record<string, unknown> = {
    title,
    excerpt: str(form, "excerpt", 300),
    body: str(form, "body", 20000),
    category: str(form, "category", 20),
    grades: grades(form),
    status: form.get("publish") === "on" ? "published" : "draft",
    published_at: str(form, "published_at", 10) || new Date().toISOString().slice(0, 10),
    image_consent: form.get("image_consent") === "on",
    updated_at: new Date().toISOString(),
  };

  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/") || image.size > MAX_IMAGE) redirect(`/admin/news/${id || "new"}?e=image`);
    const ext = (image.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `news/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, image, { contentType: image.type });
    if (error) redirect(`/admin/news/${id || "new"}?e=upload`);
    row.image_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }
  if (form.get("remove_image") === "on") row.image_url = null;

  let saved: { id: string; slug: string; status: string; image_url: string | null; excerpt: string; title: string; facebook_post_id: string | null; instagram_media_id: string | null };
  const columns = "id,slug,status,image_url,excerpt,title,facebook_post_id,instagram_media_id";
  if (id) {
    const { data, error } = await supabase.from("news").update(row).eq("id", id).select(columns).single();
    if (error || !data) redirect(`/admin/news/${id}?e=save`);
    saved = data;
  } else {
    const slug = `${row.published_at}-${randomUUID().slice(0, 6)}`;
    const { data, error } = await supabase.from("news").insert({ ...row, slug, author_id: user.id }).select(columns).single();
    if (error || !data) redirect("/admin/news/new?e=save");
    saved = data;
  }

  // النشر على فيسبوك وإنستجرام مرة واحدة فقط لكل خبر منشور
  const wantFb = form.get("to_facebook") === "on" && !saved.facebook_post_id;
  const wantIg = form.get("to_instagram") === "on" && !saved.instagram_media_id;
  let social = "";
  if (saved.status === "published" && (wantFb || wantIg)) {
    const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
    const results = await publishEverywhere(
      {
        message: [saved.title, saved.excerpt].filter(Boolean).join("\n\n"),
        link: siteUrl ? `${siteUrl}/news/${saved.slug}` : undefined,
        imageUrl: saved.image_url ?? undefined,
      },
      { facebook: wantFb, instagram: wantIg },
    );
    await supabase.from("social_posts").insert(
      results.map((r) => ({ news_id: saved.id, platform: r.platform, ok: r.ok, external_id: r.id ?? null, error: r.error ?? null })),
    );
    const ids: Record<string, string> = {};
    for (const r of results) {
      if (r.ok && r.id) ids[r.platform === "facebook" ? "facebook_post_id" : "instagram_media_id"] = r.id;
    }
    if (Object.keys(ids).length) await supabase.from("news").update(ids).eq("id", saved.id);
    social = "&social=" + results.map((r) => `${r.platform}:${r.ok ? "ok" : "fail"}`).join(",");
  }

  refreshSite();
  redirect(`/admin/news/${saved.id}?saved=1${social}`);
}

export async function deleteNews(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  await supabase.from("news").delete().eq("id", str(form, "id", 40));
  refreshSite();
  redirect("/admin/news");
}

// ========== الإعلانات ==========

export async function saveAnnouncement(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  const title = str(form, "title", 200);
  if (title) {
    await supabase.from("announcements").insert({
      title,
      body: str(form, "body", 2000),
      urgent: form.get("urgent") === "on",
      grades: grades(form),
      date: str(form, "date", 10) || new Date().toISOString().slice(0, 10),
      expires_on: str(form, "expires_on", 10) || null,
    });
    refreshSite();
  }
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  await supabase.from("announcements").delete().eq("id", str(form, "id", 40));
  refreshSite();
  redirect("/admin/announcements");
}

// ========== الرزنامة ==========

export async function saveEvent(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  const title = str(form, "title", 200);
  const date = str(form, "date", 10);
  if (title && date) {
    await supabase.from("events").insert({
      title,
      date,
      type: str(form, "type", 10),
      confirmed: form.get("confirmed") === "on",
      grades: grades(form),
    });
    refreshSite();
  }
  redirect("/admin/events");
}

export async function deleteEvent(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  await supabase.from("events").delete().eq("id", str(form, "id", 40));
  refreshSite();
  redirect("/admin/events");
}

// ========== مراجعة مشاركات الطلاب ==========

export async function reviewSubmission(form: FormData) {
  const { supabase, user } = await requireRole(["admin", "editor", "teacher"]);
  const status = str(form, "status", 10);
  if (status === "approved" || status === "rejected") {
    await supabase
      .from("submissions")
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq("id", str(form, "id", 40));
    revalidatePath("/participate", "layout");
  }
  redirect("/admin/submissions");
}

// ========== الرسائل ==========

export async function markMessage(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  await supabase.from("contact_messages").update({ handled: form.get("handled") === "1" }).eq("id", str(form, "id", 40));
  redirect("/admin/messages");
}

// ========== التصويت ==========

export async function createPoll(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  const question = str(form, "question", 300);
  const options = str(form, "options", 2000).split("\n").map((o) => o.trim()).filter(Boolean).slice(0, 8);
  if (question && options.length >= 2) {
    const { data: poll } = await supabase.from("polls").insert({ question }).select("id").single();
    if (poll) {
      await supabase.from("poll_options").insert(options.map((label, position) => ({ poll_id: poll.id, label, position })));
    }
    revalidatePath("/participate/vote");
  }
  redirect("/admin/polls");
}

export async function togglePoll(form: FormData) {
  const { supabase } = await requireRole(["admin", "editor"]);
  await supabase.from("polls").update({ active: form.get("active") === "1" }).eq("id", str(form, "id", 40));
  revalidatePath("/participate/vote");
  redirect("/admin/polls");
}
