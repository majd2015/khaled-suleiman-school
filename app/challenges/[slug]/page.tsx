import { notFound } from "next/navigation";
import { challenges } from "@/content/data";
import { PageHead } from "@/components/ui";
import ChallengeSolver from "@/components/ChallengeSolver";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = challenges.find((x) => x.slug === slug);
  return c ? { title: c.title, description: `تحدٍّ في ${c.subject} لمستوى ${c.level}: ${c.question}`.slice(0, 160) } : {};
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = challenges.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <PageHead title={c.title} subtitle={`${c.subject} · ${c.level} · ${c.minutes} دقائق`} />
      <section className="section">
        <div className="container prose">
          <div className="card">
            <p style={{ fontSize: "1.2rem", color: "var(--text)" }}>{c.question}</p>
            <ChallengeSolver slug={c.slug} hints={c.hints} answer={c.answer} />
          </div>
        </div>
      </section>
    </>
  );
}
