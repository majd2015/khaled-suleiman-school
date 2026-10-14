import { cookies } from "next/headers";
import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import Poll, { type PollResult } from "@/components/Poll";
import { isDbConfigured, supabasePublic } from "@/lib/supabase/server";

export const metadata = { title: "التصويت" };
export const dynamic = "force-dynamic";

export default async function Vote() {
  const jar = await cookies();
  let polls: { id: string; question: string; results: PollResult[] }[] = [];
  if (isDbConfigured()) {
    const supabase = supabasePublic();
    const { data } = await supabase.from("polls").select("id,question").eq("active", true).order("created_at", { ascending: false });
    polls = await Promise.all(
      (data ?? []).map(async (p) => {
        const { data: results } = await supabase.rpc("poll_results", { p_poll: p.id });
        return { ...p, results: (results ?? []) as PollResult[] };
      }),
    );
  }

  return (
    <>
      <PageHead title="التصويت" subtitle="رأيك يهمّنا" />
      <section className="section">
        <div className="container split">
          <div style={{ display: "grid", gap: 20 }}>
            {polls.length === 0 && <p className="card">لا يوجد تصويت مفتوح حاليًا.</p>}
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
