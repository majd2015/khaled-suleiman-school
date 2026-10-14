import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";

export default async function AdminHome() {
  const { role } = await requireRole(["admin", "editor", "teacher"]);
  const isEditor = role !== "teacher";
  const [pending, messages, drafts, published] = await Promise.all([
    db().submission.count({ where: { status: "pending" } }),
    isEditor ? db().contactMessage.count({ where: { handled: false } }) : 0,
    isEditor ? db().news.count({ where: { status: "draft" } }) : 0,
    isEditor ? db().news.count({ where: { status: "published" } }) : 0,
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
