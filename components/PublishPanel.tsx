"use client";

import { useState } from "react";

type Result = { platform: string; ok: boolean; id?: string; error?: string };

export default function PublishPanel({ items }: { items: { slug: string; title: string }[] }) {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError(""); setResults(null);
    try {
      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${f.get("token")}` },
        body: JSON.stringify({
          slug: f.get("slug") || undefined,
          imageUrl: f.get("imageUrl") || undefined,
          facebook: f.get("facebook") === "on",
          instagram: f.get("instagram") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "فشل النشر");
      else setResults(data.results);
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="stack card" onSubmit={onSubmit}>
      <label>كلمة سر الإدارة<input name="token" type="password" required /></label>
      <label>الخبر
        <select name="slug">{items.map((i) => <option key={i.slug} value={i.slug}>{i.title}</option>)}</select>
      </label>
      <label>رابط صورة (اختياري، وإلزامي لإنستجرام)<input name="imageUrl" type="url" dir="ltr" /></label>
      <label style={{ fontWeight: 400 }}><input type="checkbox" name="facebook" defaultChecked /> فيسبوك</label>
      <label style={{ fontWeight: 400 }}><input type="checkbox" name="instagram" defaultChecked /> إنستجرام</label>
      <button className="btn" disabled={busy}>{busy ? "جارٍ النشر..." : "انشر"}</button>
      {error && <p className="badge urgent">{error}</p>}
      {results?.map((r) => (
        <p key={r.platform}>{r.platform}: {r.ok ? `✓ نُشر (${r.id})` : `✗ ${r.error}`}</p>
      ))}
    </form>
  );
}
