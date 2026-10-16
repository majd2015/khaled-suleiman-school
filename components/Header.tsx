"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { BookOpen, ArrowUpLeft, Menu, X } from "lucide-react";
import { site } from "@/site.config";
const links = [
  ["/", "الرئيسية"],
  ["/school", "مدرستنا"],
  ["/grades", "الصفوف"],
  ["/articles", "مجلة آفاق"],
  ["/news", "أخبارنا"],
  ["/participate", "شارك"],
];
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>مساحة للتعلّم، وفسحة للاكتشاف.</span>
          <div className="top-links">
            <Link href="/announcements">الإعلانات</Link>
            <Link href="/calendar">الرزنامة</Link>
            <Link href="/app">على هاتفك</Link>
          </div>
        </div>
      </div>
      <header
        className="header"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <div className="container">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-symbol" aria-hidden="true">
              <BookOpen size={28} />
            </span>
            <span>
              {site.name}
              <small>نتعلّم. نشارك. ننطلق.</small>
            </span>
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-controls="site-navigation"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="site-navigation"
            aria-label="التنقل الرئيسي"
            className={"site-nav" + (open ? " open" : "")}
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={
                  (href === "/" ? path === "/" : path.startsWith(href))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
            <Link
              href="/school/contact"
              className="nav-contact"
              onClick={() => setOpen(false)}
            >
              تواصل معنا <ArrowUpLeft size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
