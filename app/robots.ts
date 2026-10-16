import type { MetadataRoute } from "next";
import { siteUrl } from "@/site.config";

// قبل ضبط SITE_URL تبقى النسخة غير مؤرشفة؛ بعد النشر تُفتح للأرشفة مع خريطة الموقع.
export default function robots(): MetadataRoute.Robots {
  if (!siteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
