import { notFound } from "next/navigation";
import { newsletters } from "@/content/data";
import { PageHead } from "@/components/ui";

export function generateStaticParams() {
  return newsletters.map((n) => ({ slug: n.slug }));
}

export default async function NewsletterIssue({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = newsletters.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <>
      <PageHead title={n.title} subtitle={n.month} />
      <section className="section">
        <div className="container">
          <div className="grid">
            {n.stories.map((s) => (
              <div key={s.title} className="card"><h3>{s.title}</h3><p>{s.text}</p></div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 24, borderTop: "4px solid var(--accent)" }}>
            <h3>سؤال للنقاش في البيت</h3>
            <p>{n.homeQuestion}</p>
          </div>
        </div>
      </section>
    </>
  );
}
