import { PageHead } from "@/components/ui";

export const metadata = { title: "الخصوصية" };

export default function Privacy() {
  return (
    <>
      <PageHead title="سياسة الخصوصية" />
      <section className="section">
        <div className="container prose">
          <p>لا يطلب الموقع تسجيل دخول لتصفّح المحتوى. تقدّم الطالب في التحديات يُحفظ على جهازه فقط.</p>
          <p>كل مشاركة يكتبها طالب تُراجَع من معلّم قبل نشرها، ولا يُنشر اسم الطالب إلا بموافقته.</p>
          <p>لا تُنشر صور الطلاب إلا بموافقة الأهالي.</p>
        </div>
      </section>
    </>
  );
}
