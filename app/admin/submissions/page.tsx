import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { DateCell, Empty } from "@/components/admin";
import { reviewSubmission } from "../actions";

const kinds: Record<string, string> = { debate: "منبر المناظرة", kind_word: "الكلمة الطيبة", reading: "نادي القراءة" };
const fieldLabels: Record<string, string> = {
  side: "الموقف", opinion: "الرأي", evidence: "الدليل", section: "الشعبة", message: "الرسالة",
  book: "الكتاب", author: "المؤلف", why: "لماذا",
};
const statuses = [
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "approved", label: "مقبولة" },
  { key: "rejected", label: "مرفوضة" },
];

export default async function AdminSubmissions({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s = "pending" } = await searchParams;
  const { supabase } = await requireRole(["admin", "editor", "teacher"]);
  const { data: rows } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", s)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <h2>مشاركات الطلاب</h2>
      <nav className="filters">
        {statuses.map((x) => <Link key={x.key} href={`/admin/submissions?s=${x.key}`} className={s === x.key ? "active" : ""}>{x.label}</Link>)}
      </nav>
      {!rows?.length ? <Empty>لا توجد مشاركات هنا.</Empty> : (
        <ul className="ann-list">
          {rows.map((r) => (
            <li key={r.id} className="card">
              <div className="meta">
                <span className="badge">{kinds[r.kind]}</span>
                <DateCell iso={r.created_at} />
                <span>{r.author_name ? `${r.author_name}${r.show_name ? " (يوافق على نشر اسمه)" : " (لا يُنشر اسمه)"}` : "بدون اسم"}</span>
              </div>
              {Object.entries(r.content as Record<string, string>).map(([k, v]) => (
                <p key={k} style={{ color: "var(--text)" }}><strong>{fieldLabels[k] ?? k}:</strong> {v}</p>
              ))}
              <div className="row-actions">
                {s !== "approved" && (
                  <form action={reviewSubmission}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="approved" /><button className="btn small">قبول ونشر</button></form>
                )}
                {s !== "rejected" && (
                  <form action={reviewSubmission}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="rejected" /><button className="btn danger small">رفض</button></form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
