"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Type } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
export default function ReaderControls({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) {
  const [large, setLarge] = useState(false),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false),
    [progress, setProgress] = useState(0);
  const article = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = article.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const range = el.offsetHeight - window.innerHeight;
        setProgress(
          range > 0
            ? Math.min(100, Math.max(0, (-rect.top / range) * 100))
            : 100,
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setCopyError(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <div
      className={"reader-content" + (large ? " large-type" : "")}
      ref={article}
    >
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: progress + "%" }} />
      </div>
      <div className="reader-toolbar">
        <BookmarkButton slug={slug} title={title} label />
        <button
          className="btn ghost"
          type="button"
          aria-pressed={large}
          onClick={() => setLarge(!large)}
        >
          <Type size={18} />
          {large ? "الحجم المعتاد" : "تكبير الخط"}
        </button>
        <button className="btn ghost" type="button" onClick={copy}>
          {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
          {copied ? "نُسخ الرابط" : "نسخ الرابط"}
        </button>
        <span className="sr-only" role="status">
          {copied ? "نُسخ رابط المقال" : ""}
        </span>
        {copyError && (
          <p role="status">
            تعذّر النسخ. يمكنك نسخ رابط المقال من شريط العنوان.
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
