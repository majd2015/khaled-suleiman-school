"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  emptyProgress,
  parseProgress,
  type PlayProgress,
} from "@/lib/play-engine";
const KEY = "afaq-play-v1";
type ProgressContext = {
  progress: PlayProgress;
  ready: boolean;
  persistent: boolean;
  complete: (id: string) => void;
  saveDraft: (id: string, text: string) => void;
  vote: (value: string) => void;
  reset: () => void;
};
const Context = createContext<ProgressContext | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress),
    [ready, setReady] = useState(false),
    [persistent, setPersistent] = useState(true);
  const current = useRef(progress),
    storageWorks = useRef(true);
  useEffect(() => {
    const read = () => {
      try {
        const next = parseProgress(localStorage.getItem(KEY));
        current.current = next;
        setProgress(next);
      } catch {
        setPersistent(false);
      }
      setReady(true);
    };
    read();
    const listen = (event: StorageEvent) => {
      if (event.key === KEY || event.key === null) read();
    };
    window.addEventListener("storage", listen);
    return () => window.removeEventListener("storage", listen);
  }, []);
  const update = useCallback((fn: (value: PlayProgress) => PlayProgress) => {
    let previous = current.current;
    try {
      if (storageWorks.current)
        previous = parseProgress(localStorage.getItem(KEY));
    } catch {
      storageWorks.current = false;
    }
    const next = fn(previous);
    current.current = next;
    setProgress(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      storageWorks.current = true;
      setPersistent(true);
    } catch {
      storageWorks.current = false;
      setPersistent(false);
    }
  }, []);
  const complete = useCallback(
    (id: string) =>
      update((p) => ({
        ...p,
        completed: {
          ...p.completed,
          [id]: p.completed[id] || new Date().toISOString(),
        },
      })),
    [update],
  );
  const saveDraft = useCallback(
    (id: string, text: string) =>
      update((p) => ({
        ...p,
        drafts: { ...p.drafts, [id]: text.slice(0, 4000) },
      })),
    [update],
  );
  const vote = useCallback(
    (value: string) => update((p) => ({ ...p, vote: value })),
    [update],
  );
  const reset = useCallback(() => update(() => emptyProgress()), [update]);
  return (
    <Context.Provider
      value={{ progress, ready, persistent, complete, saveDraft, vote, reset }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const context = useContext(Context);
  if (!context) throw new Error("Play progress requires its provider");
  return context;
}
export function StorageNotice() {
  const { persistent } = useProgress();
  return (
    <p className="play-local-note">
      {persistent
        ? "تقدّمك ومسوداتك محفوظة في هذا المتصفح فقط، دون حساب أو ترتيب علني. مسح بيانات المتصفح يحذفها."
        : "الحفظ غير متاح في هذا المتصفح. يمكنك اللعب، لكن بيانات هذه الجلسة قد لا تبقى بعد إغلاقها."}
    </p>
  );
}
export function downloadText(
  filename: string,
  text: string,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob(["\uFEFF", text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
