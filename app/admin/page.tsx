import Link from "next/link";
import { requireRole } from "@/lib/auth";

export default async function AdminHome() {
  const { supabase, role } = await requireRole(["admin", "editor", "teacher"]);
  const count = async (table: string, filter?: [string, string | boolean]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return (await q).count ?? 0;
  };
  const isEditor = role !== "teacher";
  const [pending, messages, drafts, published] = await Promise.all([
    count("submissions", ["status", "pending"]),
    isEditor ? count("contact_messages", ["handled", false]) : 0,
    isEditor ? count("news", ["status", "draft"]) : 0,
    isEditor ? count("news", ["status", "published"]) : 0,
  ]);

  const cards = [
    { href: "/admin/submissions", label: "مشاركات بانتظار المراجعة", value: pending, show: true },
    { href: "/admin/messages", label: "رسائل جديدة", value: messages, show: isEditor },
    { href: "/admin/news", label: "أخبار منشورة", value: published, show: isEditor },
    { href: "/admin/news", label: "مسودات", value: drafts, show: isEditor },
  ];

  return (
    <>
      <div className="section-title">
        <h2>لوحة الإدارة</h2>
        {isEditor && <Link href="/admin/news/new" className="btn">+ خبر جديد</Link>}
      </div>
      <div className="grid">
        {cards.filter((c) => c.show).map((c) => (
          <Link key={c.label} href={c.href} className="card link" style={{ color: "inherit" }}>
            <div className="stat">{c.value}</div>
            <p>{c.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
