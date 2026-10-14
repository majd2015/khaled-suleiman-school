import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { DateCell, Empty } from "@/components/admin";

export default async function AdminNews() {
  await requireRole(["admin", "editor"]);
  const rows = await db().news.findMany({ orderBy: { publishedAt: "desc" }, take: 200 });

  return (
    <>
      <div className="section-title">
        <h2>الأخبار</h2>
        <Link href="/admin/news/new" className="btn">+ خبر جديد</Link>
      </div>
      {!rows?.length ? (
        <Empty>لا توجد أخبار بعد.</Empty>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>العنوان</th><th>التاريخ</th><th>التصنيف</th><th>الحالة</th><th>فيسبوك/إنستجرام</th></tr></thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id}>
                  <td><Link href={`/admin/news/${n.id}`}>{n.title}</Link></td>
                  <td><DateCell iso={n.publishedAt} /></td>
                  <td>{n.category}</td>
                  <td>{n.status === "published" ? "منشور" : "مسودة"}</td>
                  <td>{[n.facebookPostId && "فيسبوك ✓", n.instagramMediaId && "إنستجرام ✓"].filter(Boolean).join(" · ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
