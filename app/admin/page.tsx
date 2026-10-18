import Link from "next/link";
import { news } from "@/content/data";
import { PageHead } from "@/components/ui";
import PublishPanel from "@/components/PublishPanel";

export const metadata = { title: "لوحة النشر", robots: { index: false } };

export default function Admin() {
  return (
    <>
      <PageHead title="لوحة النشر" subtitle="نشر الأخبار على فيسبوك وإنستجرام المدرسة" />
      <section className="section">
        <div className="container prose">
          <p><Link className="btn" href="/admin/calendar">إدارة الرزنامة والمواعيد</Link></p>
          {news.some(n => !n.sample) ? <PublishPanel items={news.filter(n => !n.sample).map((n) => ({ slug: n.slug, title: n.title }))} /> : <p className="card">الأخبار الموجودة تجريبية. أضف خبرًا معتمدًا واربط حسابات المدرسة قبل استخدام النشر.</p>}
        </div>
      </section>
    </>
  );
}
