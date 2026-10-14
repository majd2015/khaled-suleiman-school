import { PageHead, Pending } from "@/components/ui";

export const metadata = { title: "الرؤية والرسالة" };

export default function Vision() {
  return (
    <>
      <PageHead title="الرؤية والرسالة" />
      <section className="section">
        <div className="container grid">
          <div className="card"><h3>الرؤية</h3><p><Pending>رؤية المدرسة</Pending></p></div>
          <div className="card"><h3>الرسالة</h3><p><Pending>رسالة المدرسة</Pending></p></div>
          <div className="card"><h3>القيم</h3><p><Pending>قيم المدرسة</Pending></p></div>
        </div>
      </section>
    </>
  );
}
