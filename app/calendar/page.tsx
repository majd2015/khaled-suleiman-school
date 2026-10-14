import Link from "next/link";
import { events, type EventType } from "@/content/data";
import { PageHead, formatDate } from "@/components/ui";

export const metadata = { title: "الرزنامة" };

const types: EventType[] = ["امتحان", "نشاط", "عطلة", "عام"];

export default async function Calendar({ searchParams }: { searchParams: Promise<{ type?: string; grade?: string }> }) {
  const { type, grade } = await searchParams;
  const list = [...events]
    .filter((e) => !type || e.type === type)
    .filter((e) => !grade || !e.grades || e.grades.includes(Number(grade)))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHead title="الرزنامة" subtitle="امتحانات ونشاطات وعطل السنة الدراسية" />
      <section className="section">
        <div className="container">
          <nav className="filters">
            <Link href="/calendar" className={!type && !grade ? "active" : ""}>الكل</Link>
            {types.map((t) => (
              <Link key={t} href={`/calendar?type=${t}`} className={type === t ? "active" : ""}>{t}</Link>
            ))}
            {[7, 8, 9].map((g) => (
              <Link key={g} href={`/calendar?grade=${g}`} className={grade === String(g) ? "active" : ""}>الصف {g}</Link>
            ))}
            <a href="/calendar.ics">أضف إلى تقويم الهاتف</a>
          </nav>
          <table className="cal-table">
            <thead>
              <tr><th>التاريخ</th><th>الموعد</th><th>النوع</th><th>الصفوف</th><th>الحالة</th></tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>{e.title}</td>
                  <td className={`type-${e.type}`}>{e.type}</td>
                  <td>{e.grades ? e.grades.join("، ") : "الكل"}</td>
                  <td>{e.confirmed ? "مؤكَّد" : "مقترَح"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
