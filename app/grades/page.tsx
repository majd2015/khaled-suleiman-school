import Link from "next/link";
import { grades } from "@/content/data";
import { PageHead } from "@/components/ui";

export const metadata = { title: "الصفوف" };

export default function Grades() {
  return (
    <>
      <PageHead title="الصفوف" subtitle="لكل صف شعار وهدف ومسار خاص" />
      <section className="section">
        <div className="container grid">
          {grades.map((g) => (
            <Link key={g.id} href={`/grades/${g.id}`} className="card link grade-card" style={{ color: "inherit", ["--gc" as string]: g.color }}>
              <h3>{g.name}</h3>
              <p className="motto">{g.motto}</p>
              <p>{g.intro}</p>
              <p>{g.sections.length} شعب</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
