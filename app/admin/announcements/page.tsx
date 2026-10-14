import { requireRole } from "@/lib/auth";
import { DateCell, Empty, GradeChecks, GradesLabel } from "@/components/admin";
import { deleteAnnouncement, saveAnnouncement } from "../actions";

export default async function AdminAnnouncements() {
  const { supabase } = await requireRole(["admin", "editor"]);
  const { data: rows } = await supabase.from("announcements").select("*").order("date", { ascending: false }).limit(200);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h2>الإعلانات</h2>
      <form className="stack card" action={saveAnnouncement} style={{ maxWidth: 760, marginBottom: 24 }}>
        <h3>إعلان جديد</h3>
        <label>العنوان<input name="title" required maxLength={200} /></label>
        <label>النص<textarea name="body" rows={3} maxLength={2000} /></label>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <label>التاريخ<input type="date" name="date" defaultValue={today} /></label>
          <label>يختفي بعد (اختياري)<input type="date" name="expires_on" /></label>
        </div>
        <GradeChecks />
        <label style={{ fontWeight: 400 }}><input type="checkbox" name="urgent" /> عاجل</label>
        <button className="btn">نشر الإعلان</button>
      </form>

      {!rows?.length ? <Empty>لا توجد إعلانات.</Empty> : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>العنوان</th><th>التاريخ</th><th>الصفوف</th><th>ينتهي</th><th></th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.urgent && <span className="badge urgent">عاجل</span>} {a.title}<br /><small>{a.body}</small></td>
                  <td><DateCell iso={a.date} /></td>
                  <td><GradesLabel grades={a.grades} /></td>
                  <td>{a.expires_on ? <DateCell iso={a.expires_on} /> : "—"}</td>
                  <td>
                    <form action={deleteAnnouncement}><input type="hidden" name="id" value={a.id} /><button className="btn danger small">حذف</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
