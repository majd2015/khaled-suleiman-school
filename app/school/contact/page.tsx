import { site } from "@/site.config";
import { PageHead } from "@/components/ui";

export const metadata = { title: "اتصل بنا" };

export default function Contact() {
  const c = site.contact;
  return (
    <>
      <PageHead title="اتصل بنا" />
      <section className="section">
        <div className="container grid">
          <div className="card">
            <h3>بيانات التواصل</h3>
            <p>العنوان: {c.address}</p>
            <p>هاتف: {c.phone}</p>
            <p>فاكس: {c.fax}</p>
            <p>بريد: {c.email}</p>
            <p>ساعات الدوام: {c.hours}</p>
            {c.mapUrl && <a href={c.mapUrl}>الموقع على الخريطة</a>}
          </div>
          <form className="card stack" action="mailto:" method="post">
            <h3>أرسل رسالة</h3>
            <label>الاسم<input name="name" required /></label>
            <label>رقم الهاتف<input name="phone" /></label>
            <label>الرسالة<textarea name="message" rows={4} required /></label>
            <button className="btn" type="submit">إرسال</button>
          </form>
        </div>
      </section>
    </>
  );
}
