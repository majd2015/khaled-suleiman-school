import { PageHead, Pending } from "@/components/ui";

export const metadata = { title: "الطاقم" };

const roles = ["المديرة", "نائب المديرة", "المستشارة التربوية", "مركّز/ة الصف السابع", "مركّز/ة الصف الثامن", "مركّز/ة الصف التاسع"];

export default function Staff() {
  return (
    <>
      <PageHead title="طاقم المدرسة" />
      <section className="section">
        <div className="container grid">
          {roles.map((r) => (
            <div key={r} className="card">
              <h3>{r}</h3>
              <p><Pending>الاسم</Pending></p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
