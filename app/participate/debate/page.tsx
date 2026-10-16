import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";
import { isDbConfigured } from "@/lib/prisma";
import { getApproved } from "@/lib/submissions";

export const metadata = { title: "منبر المناظرة" };

export const revalidate = 60;

export default async function Debate() {
  const approved = await getApproved("debate");
  return (
    <>
      <PageHead title="منبر المناظرة" subtitle="سؤال هذا الأسبوع" />
      <section className="section">
        <div className="container split">
          <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>هل يجب أن يُسمح بالهاتف المحمول في الاستراحة؟ (سؤال تجريبي)</h3>
          </div>
          <SubmitForm kind="debate" enabled={isDbConfigured()} fields={[
            { name: "side", label: "موقفي", type: "select", options: ["مع", "ضد", "بين بين"] },
            { name: "opinion", label: "رأيي", type: "textarea" },
            { name: "evidence", label: "الدليل على رأيي", type: "textarea" },
          ]} />
          {approved.length > 0 && (
            <>
              <h2 style={{ marginTop: 32 }}>آراء الطلاب</h2>
              <ul className="ann-list">
                {approved.map((a) => (
                  <li key={a.id} className="card">
                    <div className="meta"><span className="badge">{a.content.side}</span>{a.name && <span>{a.name}</span>}</div>
                    <p style={{ color: "var(--text)" }}>{a.content.opinion}</p>
                    <p>الدليل: {a.content.evidence}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
          </div>
          <Illustration id="debate-dialogue" className="art" />
        </div>
      </section>
    </>
  );
}
