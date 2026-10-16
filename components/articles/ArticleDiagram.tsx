"use client";
import { useRef } from "react";
import { Maximize2, X, Download } from "lucide-react";
import type { Article } from "@/lib/articles";
export default function ArticleDiagram({
  diagram: d,
}: {
  diagram: NonNullable<Article["diagram"]>;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement>(null);
  const src = "/assets/diagrams/" + d.src.split("/").pop();
  return (
    <figure className="article-diagram">
      <img src={src} alt={d.alt} width={1200} height={720} loading="lazy" />
      <figcaption>{d.caption}</figcaption>
      <div className="actions">
        <button
          type="button"
          className="btn ghost"
          ref={opener}
          onClick={() => dialog.current?.showModal()}
        >
          <Maximize2 size={16} /> تكبير الرسم
        </button>
        <a className="text-link" href={src} download>
          <Download size={16} /> تنزيل الرسم
        </a>
      </div>
      <dialog
        ref={dialog}
        className="diagram-dialog"
        aria-label="الرسم التوضيحي مكبّرًا"
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <button
          className="icon-button"
          aria-label="إغلاق الرسم"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <img src={src} width={1200} height={720} alt={d.alt} />
        <p>{d.caption}</p>
      </dialog>
    </figure>
  );
}
