import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem } from "@/lib/news";
import { PageHead, formatDate } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return { title: item?.title, description: item?.excerpt };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();
  return (
    <>
      <PageHead title={item.title} subtitle={`${item.category} · ${formatDate(item.date)}`} />
      <section className="section">
        <article className="container prose">
          {item.sample && <p className="demo-notice">خبر تجريبي لعرض التصميم؛ لا يوثّق حدثًا معتمدًا من المدرسة.</p>}
          {item.image && <img src={item.image} alt="" style={{ borderRadius: 14, marginBottom: 16 }} />}
          {item.body.map((p, i) => <p key={i}>{p}</p>)}
          {item.sourceUrl && <p><a href={item.sourceUrl}>عرض المنشور على فيسبوك</a></p>}
          <p><Link href="/news">→ العودة إلى الأخبار</Link></p>
        </article>
      </section>
    </>
  );
}
