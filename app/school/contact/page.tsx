import { site } from "@/site.config";
import { PageHead } from "@/components/ui";
import { Icon } from "@/components/icons";

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
            <p className="inline-icon"><Icon name="address" size={20} />العنوان: {c.address}</p>
            <p className="inline-icon"><Icon name="phone" size={20} />هاتف: {c.phone}</p>
            <p>فاكس: {c.fax}</p>
            <p className="inline-icon"><Icon name="contact" size={20} />بريد: {c.email}</p>
            <p className="inline-icon"><Icon name="clock" size={20} />ساعات الدوام: {c.hours}</p>
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
