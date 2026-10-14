import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { DateCell, Empty } from "@/components/admin";

export default async function AdminNews() {
  const { supabase } = await requireRole(["admin", "editor"]);
  const { data: rows } = await supabase
    .from("news")
    .select("id,title,status,published_at,category,facebook_post_id,instagram_media_id")
    .order("published_at", { ascending: false })
    .limit(200);

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
                  <td><DateCell iso={n.published_at} /></td>
                  <td>{n.category}</td>
                  <td>{n.status === "published" ? "منشور" : "مسودة"}</td>
                  <td>{[n.facebook_post_id && "فيسبوك ✓", n.instagram_media_id && "إنستجرام ✓"].filter(Boolean).join(" · ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
