"use client";
import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
export const STORAGE_KEY = "ks-school-reading-list-v1";
const eventName = "ks-reading-list-change";
let memory: string[] = [];
let storageAvailable = true;
export function readSaved(): string[] {
  if (!storageAvailable) return memory;
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(value))
      memory = value.filter((x) => typeof x === "string");
  } catch {
    storageAvailable = false;
  }
  return memory;
}
export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setSaved([...readSaved()]);
    update();
    window.addEventListener(eventName, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(eventName, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return saved;
}
export default function BookmarkButton({
  slug,
  title,
  label = false,
}: {
  slug: string;
  title: string;
  label?: boolean;
}) {
  const saved = useSaved().includes(slug);
  const [temporary, setTemporary] = useState(false);
  function toggle() {
    const current = readSaved();
    memory = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch {
      storageAvailable = false;
      setTemporary(true);
    }
    window.dispatchEvent(new Event(eventName));
  }
  return (
    <span className="bookmark-control">
      <button
        type="button"
        className={label ? "btn ghost" : "icon-button"}
        aria-label={(saved ? "إزالة من المحفوظات: " : "حفظ للقراءة: ") + title}
        aria-pressed={saved}
        onClick={toggle}
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{" "}
        {label && (saved ? "محفوظ للقراءة" : "احفظ للقراءة")}
      </button>
      {temporary && (
        <span className="storage-note" role="status">
          الحفظ مؤقت لهذه الجلسة.
        </span>
      )}
    </span>
  );
}
