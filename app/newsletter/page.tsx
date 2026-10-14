import Link from "next/link";
import { newsletters } from "@/content/data";
import { PageHead } from "@/components/ui";

export const metadata = { title: "النشرة الشهرية" };

export default function Newsletters() {
  return (
    <>
      <PageHead title="النشرة الشهرية" subtitle="عدد كل شهر: قصص من الصفوف وسؤال للبيت" />
      <section className="section">
        <div className="container grid">
          {newsletters.map((n) => (
            <Link key={n.slug} href={`/newsletter/${n.slug}`} className="card link" style={{ color: "inherit" }}>
              <h3>{n.title}</h3>
              <p>{n.month}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
