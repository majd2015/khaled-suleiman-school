import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { DateCell, Empty, GradeChecks, GradesLabel } from "@/components/admin";
import { deleteEvent, saveEvent } from "../actions";

const types = ["امتحان", "نشاط", "عطلة", "عام"];

export default async function AdminEvents() {
  await requireRole(["admin", "editor"]);
  const rows = await db().event.findMany({ orderBy: { date: "asc" }, take: 500 });

  return (
    <>
      <h2>الرزنامة</h2>
      <form className="stack card" action={saveEvent} style={{ maxWidth: 760, marginBottom: 24 }}>
        <h3>موعد جديد</h3>
        <label>العنوان<input name="title" required maxLength={200} /></label>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <label>التاريخ<input type="date" name="date" required /></label>
          <label>النوع<select name="type">{types.map((t) => <option key={t}>{t}</option>)}</select></label>
        </div>
        <GradeChecks />
        <label style={{ fontWeight: 400 }}><input type="checkbox" name="confirmed" defaultChecked /> موعد مؤكَّد (بدون علامة = مقترح)</label>
        <button className="btn">إضافة</button>
      </form>

      {!rows.length ? <Empty>لا توجد مواعيد.</Empty> : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>التاريخ</th><th>الموعد</th><th>النوع</th><th>الصفوف</th><th>الحالة</th><th></th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td><DateCell iso={e.date} /></td>
                  <td>{e.title}</td>
                  <td className={`type-${e.type}`}>{e.type}</td>
                  <td><GradesLabel grades={e.grades} /></td>
                  <td>{e.confirmed ? "مؤكَّد" : "مقترَح"}</td>
                  <td><form action={deleteEvent}><input type="hidden" name="id" value={e.id} /><button className="btn danger small">حذف</button></form></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
