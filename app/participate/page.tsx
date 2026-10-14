import Link from "next/link";
import { PageHead } from "@/components/ui";

export const metadata = { title: "شارك" };

const items = [
  { href: "/challenges", title: "تحدَّ نفسك", text: "تحديات يومية وأسبوعية في كل المواد." },
  { href: "/participate/debate", title: "منبر المناظرة", text: "سؤال أسبوعي، اكتب رأيك مع الدليل." },
  { href: "/participate/vote", title: "التصويت", text: "استطلاعات للطلاب والأهالي والمعلمين." },
  { href: "/participate/kind-word", title: "الكلمة الطيبة صدقة", text: "رسالة شكر تُعلَّق على شجرة الشعبة." },
  { href: "/participate/reading", title: "نادي القراءة", text: "أوصِ زملاءك بكتاب أحببته." },
  { href: "/newsletter", title: "النشرة الشهرية", text: "قصص الشهر من كل الصفوف." },
];

export default function Participate() {
  return (
    <>
      <PageHead title="شارك" subtitle="كل ما يكتبه الطالب يراجعه معلّم قبل النشر" />
      <section className="section">
        <div className="container grid">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="card link" style={{ color: "inherit" }}>
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
