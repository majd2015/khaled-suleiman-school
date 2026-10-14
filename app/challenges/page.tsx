import Link from "next/link";
import { challenges } from "@/content/data";
import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";

export const metadata = { title: "تحدَّ نفسك" };

export default async function Challenges({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const subjects = [...new Set(challenges.map((c) => c.subject))];
  const list = challenges.filter((c) => !subject || c.subject === subject);
  return (
    <>
      <PageHead title="تحدَّ نفسك" subtitle="تحديات في كل المواد، مع تلميحات تدريجية" />
      <section className="section">
        <div className="container">
          <div className="split" style={{ marginBottom: 24 }}>
            <p className="prose">اختر تحدّيًا يناسب صفك. لكل تحدٍّ تلميحات تظهر واحدًا تلو الآخر، وتقدّمك يُحفظ على جهازك.</p>
            <Illustration id="challenge-lab" className="art" />
          </div>
          <nav className="filters">
            <Link href="/challenges" className={!subject ? "active" : ""}>الكل</Link>
            {subjects.map((s) => (
              <Link key={s} href={`/challenges?subject=${s}`} className={subject === s ? "active" : ""}>{s}</Link>
            ))}
          </nav>
          <div className="grid">
            {list.map((c) => (
              <Link key={c.slug} href={`/challenges/${c.slug}`} className="card link" style={{ color: "inherit" }}>
                <div className="meta"><span className="badge">{c.subject}</span><span>{c.level}</span><span>{c.minutes} دقائق</span></div>
                <h3>{c.title}</h3>
                <p>للصفوف: {c.grades.join("، ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
