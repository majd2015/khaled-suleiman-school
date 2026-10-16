import Link from "next/link";
import { PageHead } from "@/components/ui";
import Illustration from "@/components/Illustration";
import type { IllustrationId } from "@/content/assets";
import { IconBadge } from "@/components/icons";

export const metadata = { title: "شارك" };

const items = [
  { href: "/challenges", art: "challenge-lab", icon: "challenges", title: "تحدَّ نفسك", text: "تحديات يومية وأسبوعية في كل المواد." },
  { href: "/participate/debate", art: "debate-dialogue", icon: "debate", title: "منبر المناظرة", text: "سؤال أسبوعي، اكتب رأيك مع الدليل." },
  { href: "/participate/vote", art: "vote-voice", icon: "vote", title: "التصويت", text: "استطلاعات للطلاب والأهالي والمعلمين." },
  { href: "/participate/kind-word", art: "kindness-garden", icon: "kindness", title: "الكلمة الطيبة صدقة", text: "رسالة شكر تُعلَّق على شجرة الشعبة." },
  { href: "/participate/reading", art: "reading-corner", icon: "reading", title: "نادي القراءة", text: "أوصِ زملاءك بكتاب أحببته." },
  { href: "/newsletter", icon: "newsletter", title: "النشرة الشهرية", text: "قصص الشهر من كل الصفوف." },
] as const;

export default function Participate() {
  return (
    <>
      <PageHead title="شارك" subtitle="رأي تدعمه بدليل، وكتاب يستحق المشاركة، وكلمة تصنع فرقًا." />
      <section className="section">
        <div className="container grid">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="card link" style={{ color: "inherit" }}>
              {"art" in i ? <Illustration id={i.art as IllustrationId} className="card-art" /> : <IconBadge name={i.icon} />}
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
