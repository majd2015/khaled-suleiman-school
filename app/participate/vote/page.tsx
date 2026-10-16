import { cookies } from "next/headers";
import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import Poll, { type PollResult } from "@/components/Poll";
import { isDbConfigured } from "@/lib/prisma";
import { getPollsWithResults } from "@/lib/submissions";

export const metadata = { title: "التصويت" };
export const dynamic = "force-dynamic";

export default async function Vote() {
  const jar = await cookies();
  let polls: { id: string; question: string; results: PollResult[] }[] = [];
  if (isDbConfigured()) polls = await getPollsWithResults(true);

  return (
    <>
      <PageHead title="التصويت" subtitle="رأيك يهمّنا" />
      <section className="section">
        <div className="container split">
          <div style={{ display: "grid", gap: 20 }}>
            {!isDbConfigured() && (
              <Poll id="trip-2026" question="إلى أين تفضّل أن تكون الرحلة السنوية؟ (استطلاع تجريبي)" options={["متحف العلوم", "محمية طبيعية", "مدينة تاريخية"]} />
            )}
            {isDbConfigured() && polls.length === 0 && <p className="card">لا يوجد تصويت مفتوح حاليًا.</p>}
            {polls.map((p) => (
              <Poll key={p.id} id={p.id} question={p.question} results={p.results} voted={jar.has(`voted-${p.id}`)} />
            ))}
          </div>
          <Illustration id="vote-voice" className="art" />
        </div>
      </section>
    </>
  );
}
