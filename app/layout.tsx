import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/site.config";
import { brandCss, themeColor } from "@/brand";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: `الموقع الرسمي لـ${site.name}، ${site.grades}.`,
  icons: { icon: "/logo.svg" },
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
