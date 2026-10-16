import Link from "next/link";
import { notFound } from "next/navigation";
import { announcements, challenges, events, grades, news } from "@/content/data";
import Illustration from "@/components/Illustration";
import { gradeIllustration } from "@/content/assets";
import { AnnouncementCard, NewsCard, PageHead, formatDate } from "@/components/ui";

export function generateStaticParams() {
  return grades.map((g) => ({ id: String(g.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: grades.find((g) => String(g.id) === id)?.name };
}

export default async function GradePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const grade = grades.find((g) => String(g.id) === id);
  if (!grade) notFound();
  const forGrade = <T extends { grades?: number[] }>(list: T[]) =>
    list.filter((x) => !x.grades || x.grades.includes(grade.id));

  return (
    <>
      <PageHead title={grade.name} subtitle={grade.motto} />
      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <p className="prose">{grade.intro}</p>
              <h2>ماذا نتوقّع منّي هذه السنة؟</h2>
              <ul>{grade.expectations.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
            <Illustration id={gradeIllustration[grade.id]} color={grade.color} priority className="art" />
          </div>

          <h2>الشُّعب</h2>
          <p className="demo-notice">أسماء الشُّعب والمربين والمواعيد أدناه نماذج تجريبية، وتنتظر بيانات المدرسة المعتمدة.</p>
          <div className="grid">
            {grade.sections.map((s) => (
              <div key={s.name} className="card grade-card" style={{ ["--gc" as string]: grade.color }}>
                <h3>{s.name}</h3>
                <p>المربي/ة: {s.teacher}</p>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: 32 }}>إعلانات الصف</h2>
          <ul className="ann-list">
            {forGrade(announcements).map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </ul>

          <h2 style={{ marginTop: 32 }}>مواعيد الصف</h2>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="مواعيد الصف"><table className="cal-table">
            <tbody>
              {forGrade(events).map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>{e.title}</td>
                  <td className={`type-${e.type}`}>{e.type}</td>
                  <td>{e.sample ? "تجريبي" : e.confirmed ? "مؤكد" : "مقترح"}</td>
                </tr>
              ))}
            </tbody>
          </table></div>

          <h2 style={{ marginTop: 32 }}>تحديات الصف</h2>
          <div className="grid">
            {challenges.filter((c) => c.grades.includes(grade.id)).map((c) => (
              <Link key={c.slug} href={`/challenges/${c.slug}`} className="card link" style={{ color: "inherit" }}>
                <h3>{c.title}</h3>
                <p>{c.subject} · {c.level} · {c.minutes} دقائق</p>
              </Link>
            ))}
          </div>

          <h2 style={{ marginTop: 32 }}>أخبار الصف</h2>
          <div className="grid">
            {news.filter((n) => n.grades?.includes(grade.id)).map((n) => <NewsCard key={n.slug} item={n} />)}
          </div>
        </div>
      </section>
    </>
  );
}
