import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";

export const metadata = { title: "منبر المناظرة" };

export default function Debate() {
  return (
    <>
      <PageHead title="منبر المناظرة" subtitle="سؤال هذا الأسبوع" />
      <section className="section">
        <div className="container split">
          <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>هل يجب أن يُسمح بالهاتف المحمول في الاستراحة؟ (سؤال تجريبي)</h3>
          </div>
          <SubmitForm fields={[
            { name: "side", label: "موقفي", type: "select", options: ["مع", "ضد", "بين بين"] },
            { name: "opinion", label: "رأيي", type: "textarea" },
            { name: "evidence", label: "الدليل على رأيي", type: "textarea" },
          ]} />
          </div>
          <Illustration id="debate-dialogue" className="art" />
        </div>
      </section>
    </>
  );
}
