import { NextResponse } from "next/server";
import { news } from "@/content/data";
import { publishEverywhere } from "@/lib/social";

// POST /api/social/publish
// Header: Authorization: Bearer <ADMIN_TOKEN>
// Body: { slug?: string, message?: string, imageUrl?: string, facebook?: boolean, instagram?: boolean }
export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      ["slug", "message", "imageUrl"].some(key => body[key] !== undefined && typeof body[key] !== "string") ||
      ["facebook", "instagram"].some(key => body[key] !== undefined && typeof body[key] !== "boolean")) {
    return NextResponse.json({ error: "بيانات النشر غير صالحة" }, { status: 400 });
  }
  if ((body.message?.length || 0) > 5000 || (body.imageUrl?.length || 0) > 2048 || (body.slug?.length || 0) > 150) {
    return NextResponse.json({ error: "تجاوزت البيانات الطول المسموح" }, { status: 400 });
  }
  if (body.facebook === false && body.instagram === false) {
    return NextResponse.json({ error: "اختر منصة للنشر" }, { status: 400 });
  }
  const siteUrl = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");

  let message: string | undefined = body.message;
  let link: string | undefined;
  let imageUrl: string | undefined = body.imageUrl;

  if (body.slug) {
    const item = news.find((n) => n.slug === body.slug);
    if (!item) return NextResponse.json({ error: "الخبر غير موجود" }, { status: 404 });
    if (item.sample) return NextResponse.json({ error: "لا يمكن نشر الأخبار التجريبية" }, { status: 400 });
    message ||= `${item.title}\n\n${item.excerpt}`;
    link = `${siteUrl}/news/${item.slug}`;
    if (!imageUrl && item.image) imageUrl = item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`;
  }
  if (!message?.trim()) return NextResponse.json({ error: "لا يوجد نص للنشر" }, { status: 400 });
  if (imageUrl) {
    try { const url = new URL(imageUrl); if (url.protocol !== "https:" || url.username || url.password) throw new Error(); }
    catch { return NextResponse.json({ error: "استخدم رابط صورة HTTPS صالحًا" }, { status: 400 }); }
  }

  const results = await publishEverywhere(
    { message, link, imageUrl },
    { facebook: body.facebook !== false, instagram: body.instagram !== false },
  );
  return NextResponse.json({ results });
}
