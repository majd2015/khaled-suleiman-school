"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/site.config";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>{site.grades}</span>
          <span>
            <Link href="/school/contact">اتصل بنا</Link> · <Link href="/app">ثبّت التطبيق</Link>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container">
          <Link href="/" className="brand">
            <img src="/logo.svg" alt="" />
            <span>
              {site.name}
              <small>{site.tagline}</small>
            </span>
          </Link>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="القائمة">
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          <ul className={`nav${open ? " open" : ""}`} onClick={() => setOpen(false)}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label}
                  {"children" in item && <ChevronDown className="chev" size={16} aria-hidden="true" />}
                </Link>
                {"children" in item && (
                  <ul className="sub">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
