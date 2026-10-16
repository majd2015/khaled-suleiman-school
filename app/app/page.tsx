import { site } from "@/site.config";
import { PageHead } from "@/components/ui";
import { IconBadge } from "@/components/icons";

export const metadata = { title: "ثبّت التطبيق" };

export default function AppPage() {
  return (
    <>
      <PageHead title="مدرستك على هاتفك" subtitle="أضف اختصار الموقع إلى الشاشة الرئيسية للوصول السريع." />
      <section className="section">
        <div className="container grid">
          <div className="card">
            <h3>على آيفون</h3>
            <p>افتح الموقع في Safari، اضغط زر المشاركة ثم &quot;إضافة إلى الشاشة الرئيسية&quot;.</p>
          </div>
          <div className="card">
            <h3>على أندرويد</h3>
            <p>افتح الموقع في Chrome، اضغط القائمة ⋮ ثم &quot;إضافة إلى الشاشة الرئيسية&quot; أو &quot;تثبيت التطبيق&quot; إذا ظهر الخيار.</p>
          </div>
          <div className="card">
            <IconBadge name="install" />
            <h3>ماذا يقدّم؟</h3>
            <p>كل أقسام {site.name} في أيقونة على شاشة هاتفك.</p>
            <p>يحتاج الموقع اتصالًا بالإنترنت؛ القراءة دون اتصال غير مفعّلة.</p>
          </div>
        </div>
      </section>
    </>
  );
}
