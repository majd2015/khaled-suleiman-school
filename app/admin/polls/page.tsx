import { requireRole } from "@/lib/auth";
import { getPollsWithResults } from "@/lib/submissions";
import { Empty } from "@/components/admin";
import { createPoll, togglePoll } from "../actions";

export default async function AdminPolls() {
  await requireRole(["admin", "editor"]);
  const withResults = await getPollsWithResults(false);

  return (
    <>
      <h2>التصويت</h2>
      <form className="stack card" action={createPoll} style={{ maxWidth: 760, marginBottom: 24 }}>
        <h3>تصويت جديد</h3>
        <label>السؤال<input name="question" required maxLength={300} /></label>
        <label>الخيارات (كل خيار في سطر، من 2 إلى 8)<textarea name="options" rows={4} required /></label>
        <button className="btn">فتح التصويت</button>
      </form>

      {!withResults.length ? <Empty>لا توجد استطلاعات.</Empty> : (
        <div className="grid">
          {withResults.map((p) => {
            const total = p.results.reduce((s, r) => s + Number(r.votes), 0);
            return (
              <div key={p.id} className="card">
                <div className="meta"><span className="badge">{p.active ? "مفتوح" : "مغلق"}</span><span>{total} صوت</span></div>
                <h3>{p.question}</h3>
                {p.results.map((r) => {
                  const pct = total ? Math.round((Number(r.votes) / total) * 100) : 0;
                  return (
                    <div key={r.option_id} style={{ marginBottom: 8 }}>
                      <div className="meta"><span>{r.label}</span><span>{r.votes} ({pct}%)</span></div>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
                <form action={togglePoll}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="active" value={p.active ? "0" : "1"} />
                  <button className="btn ghost small">{p.active ? "إغلاق التصويت" : "إعادة فتحه"}</button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
