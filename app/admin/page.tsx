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
          <PublishPanel items={news.map((n) => ({ slug: n.slug, title: n.title }))} />
        </div>
      </section>
    </>
  );
}
