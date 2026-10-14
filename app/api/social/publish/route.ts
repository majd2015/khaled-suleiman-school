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
  const siteUrl = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");

  let message: string | undefined = body.message;
  let link: string | undefined;
  let imageUrl: string | undefined = body.imageUrl;

  if (body.slug) {
    const item = news.find((n) => n.slug === body.slug);
    if (!item) return NextResponse.json({ error: "الخبر غير موجود" }, { status: 404 });
    message ||= `${item.title}\n\n${item.excerpt}`;
    link = `${siteUrl}/news/${item.slug}`;
    if (!imageUrl && item.image) imageUrl = item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`;
  }
  if (!message) return NextResponse.json({ error: "لا يوجد نص للنشر" }, { status: 400 });

  const results = await publishEverywhere(
    { message, link, imageUrl },
    { facebook: body.facebook !== false, instagram: body.instagram !== false },
  );
  return NextResponse.json({ results });
}
