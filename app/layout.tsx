import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site, siteUrl } from "@/site.config";
import { brandCss, themeColor } from "@/brand";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: `موقع ${site.name}، ${site.grades}: الأخبار والإعلانات والرزنامة، ومجلة آفاق، ومختبر تفاعلي، ومساحات مشاركة للطلاب.`,
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: { type: "website", locale: "ar", siteName: site.name },
  twitter: { card: "summary_large_image" },
  robots: siteUrl ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style dangerouslySetInnerHTML={{ __html: brandCss }} />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
