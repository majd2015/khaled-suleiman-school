import { requireRole } from "@/lib/auth";
import { DateCell, Empty } from "@/components/admin";
import { markMessage } from "../actions";

export default async function AdminMessages() {
  const { supabase } = await requireRole(["admin", "editor"]);
  const { data: rows } = await supabase
    .from("contact_messages")
    .select("*")
    .order("handled")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <h2>رسائل اتصل بنا</h2>
      {!rows?.length ? <Empty>لا توجد رسائل.</Empty> : (
        <ul className="ann-list">
          {rows.map((m) => (
            <li key={m.id} className="card" style={{ opacity: m.handled ? 0.6 : 1 }}>
              <div className="meta"><strong style={{ color: "var(--text)" }}>{m.name}</strong>{m.phone && <span dir="ltr">{m.phone}</span>}<DateCell iso={m.created_at} />{m.handled && <span className="badge">تمت المعالجة</span>}</div>
              <p style={{ color: "var(--text)", whiteSpace: "pre-wrap" }}>{m.message}</p>
              <form action={markMessage}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="handled" value={m.handled ? "0" : "1"} />
                <button className="btn ghost small">{m.handled ? "إرجاع كجديدة" : "تمت المعالجة"}</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
