import { requireRole, roleLabels, type Role } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { DateCell } from "@/components/admin";
import { createUser, updateUser } from "../actions";

const errors: Record<string, string> = {
  input: "تأكد من الإيميل والدور.",
  password: "كلمة السر يجب أن تكون 10 أحرف على الأقل.",
  exists: "يوجد مستخدم بهذا الإيميل.",
  self: "لا يمكنك إزالة صلاحية المدير عن حسابك أو إيقافه.",
};
const roles: Role[] = ["admin", "editor", "teacher"];

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { user: me } = await requireRole(["admin"]);
  const { e, ok } = await searchParams;
  const users = await db().user.findMany({ orderBy: [{ active: "desc" }, { createdAt: "asc" }] });

  return (
    <>
      <h2>المستخدمون والصلاحيات</h2>
      {e && errors[e] && <p className="notice bad">{errors[e]}</p>}
      {ok && <p className="notice">تم الحفظ.</p>}
      <p className="meta">مدير: كل شيء. محرر: الأخبار والإعلانات والرزنامة والرسائل والتصويت. معلم: مراجعة مشاركات الطلاب فقط.</p>

      <form className="stack card" action={createUser} style={{ maxWidth: 760, marginBottom: 24 }}>
        <h3>مستخدم جديد</h3>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <label>الاسم<input name="name" maxLength={100} /></label>
          <label>الإيميل<input name="email" type="email" required dir="ltr" /></label>
          <label>كلمة السر<input name="password" type="password" required minLength={10} autoComplete="new-password" dir="ltr" /></label>
          <label>الدور
            <select name="role" defaultValue="editor">
              {roles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
            </select>
          </label>
        </div>
        <button className="btn">إضافة</button>
      </form>

      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>المستخدم</th><th>أُضيف</th><th>الدور والحالة</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ opacity: u.active ? 1 : 0.6 }}>
                <td>{u.name || "—"}{u.id === me.id && <span className="badge"> أنت</span>}<br /><small dir="ltr">{u.email}</small></td>
                <td><DateCell iso={u.createdAt} /></td>
                <td>
                  <form action={updateUser} className="meta" style={{ margin: 0, flexWrap: "wrap", gap: 8 }}>
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role}>
                      {roles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
                    </select>
                    <label style={{ fontWeight: 400 }}><input type="checkbox" name="active" defaultChecked={u.active} /> فعّال</label>
                    <input name="password" type="password" placeholder="كلمة سر جديدة (اختياري)" minLength={10} autoComplete="new-password" dir="ltr" />
                    <button className="btn ghost small">حفظ</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
