import Link from "next/link";
import { notFound } from "next/navigation";
import { news } from "@/content/data";
import { PageHead, formatDate } from "@/components/ui";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  return { title: item?.title, description: item?.excerpt };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageHead title={item.title} subtitle={`${item.category} · ${formatDate(item.date)}`} />
      <section className="section">
        <article className="container prose">
          {item.image && <img src={item.image} alt="" style={{ borderRadius: 14, marginBottom: 16 }} />}
          {item.body.map((p, i) => <p key={i}>{p}</p>)}
          <p><Link href="/news">→ العودة إلى الأخبار</Link></p>
        </article>
      </section>
    </>
  );
}
