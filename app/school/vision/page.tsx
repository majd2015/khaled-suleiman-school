import { PageHead, Pending } from "@/components/ui";
import Illustration from "@/components/Illustration";
import { IconBadge } from "@/components/icons";

export const metadata = { title: "الرؤية والرسالة" };

export default function Vision() {
  return (
    <>
      <PageHead title="الرؤية والرسالة" />
      <section className="section">
        <div className="container">
          <div className="split" style={{ marginBottom: 24 }}>
            <p className="prose"><Pending>مقدمة قصيرة عن قيم المدرسة.</Pending></p>
            <Illustration id="school-values" className="art" />
          </div>
          <div className="grid">
          <div className="card"><IconBadge name="vision" /><h3>الرؤية</h3><p><Pending>رؤية المدرسة</Pending></p></div>
          <div className="card"><IconBadge name="reading" /><h3>الرسالة</h3><p><Pending>رسالة المدرسة</Pending></p></div>
          <div className="card"><IconBadge name="values" /><h3>القيم</h3><p><Pending>قيم المدرسة</Pending></p></div>
        </div>
          </div>
      </section>
    </>
  );
}
