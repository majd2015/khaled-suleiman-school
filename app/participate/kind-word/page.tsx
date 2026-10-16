import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";
import { isDbConfigured } from "@/lib/prisma";
import { getApproved } from "@/lib/submissions";

export const metadata = { title: "الكلمة الطيبة صدقة" };

export const revalidate = 60;

export default async function KindWord() {
  const approved = await getApproved("kind_word", 60);
  return (
    <>
      <PageHead title="الكلمة الطيبة صدقة" subtitle="تدرّب على كتابة رسالة شكر لزميل أو معلّم." />
      <section className="section">
        <div className="container split">
          <div>
          <SubmitForm kind="kind_word" enabled={isDbConfigured()} submitLabel="علّق الرسالة" fields={[
            { name: "section", label: "الشعبة", type: "select", options: ["سابع 1", "سابع 2", "سابع 3", "ثامن 1", "ثامن 2", "ثامن 3", "تاسع 1", "تاسع 2", "تاسع 3"] },
            { name: "message", label: "رسالتي", type: "textarea" },
          ]} />
          {approved.length > 0 && (
            <>
              <h2 style={{ marginTop: 32 }}>رسائل على الشجرة</h2>
              <div className="grid">
                {approved.map((a) => (
                  <div key={a.id} className="card">
                    <div className="meta"><span className="badge">{a.content.section}</span></div>
                    <p style={{ color: "var(--text)" }}>{a.content.message}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
          <Illustration id="kindness-garden" className="art" />
        </div>
      </section>
    </>
  );
}
