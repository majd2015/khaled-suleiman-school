import { site } from "@/site.config";
import { PageHead } from "@/components/ui";

export const metadata = { title: "ثبّت التطبيق" };

export default function AppPage() {
  return (
    <>
      <PageHead title="ثبّت التطبيق" subtitle="مجاني، بدون متجر وبدون حساب" />
      <section className="section">
        <div className="container grid">
          <div className="card">
            <h3>على آيفون</h3>
            <p>افتح الموقع في Safari، اضغط زر المشاركة ثم &quot;إضافة إلى الشاشة الرئيسية&quot;.</p>
          </div>
          <div className="card">
            <h3>على أندرويد</h3>
            <p>افتح الموقع في Chrome، اضغط القائمة ⋮ ثم &quot;تثبيت التطبيق&quot;.</p>
          </div>
          <div className="card">
            <h3>ماذا يقدّم؟</h3>
            <p>كل أقسام {site.name} في أيقونة على شاشة هاتفك.</p>
          </div>
        </div>
      </section>
    </>
  );
}
