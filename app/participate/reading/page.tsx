import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";
import { isDbConfigured } from "@/lib/prisma";
import { getApproved } from "@/lib/submissions";

export const metadata = { title: "نادي القراءة" };

export const revalidate = 60;

export default async function Reading() {
  const approved = await getApproved("reading");
  return (
    <>
      <PageHead title="نادي القراءة" subtitle="أوصِ زملاءك بكتاب" />
      <section className="section">
        <div className="container split">
          <div>
          <SubmitForm kind="reading" enabled={isDbConfigured()} fields={[
            { name: "book", label: "اسم الكتاب" },
            { name: "author", label: "المؤلف" },
            { name: "why", label: "لماذا أنصح به؟", type: "textarea" },
          ]} />
          {approved.length > 0 && (
            <>
              <h2 style={{ marginTop: 32 }}>رف التوصيات</h2>
              <div className="grid">
                {approved.map((a) => (
                  <div key={a.id} className="card">
                    <h3>{a.content.book}</h3>
                    <p>{a.content.author}</p>
                    <p style={{ color: "var(--text)" }}>{a.content.why}</p>
                    {a.name && <p className="meta">أوصى به: {a.name}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
          <Illustration id="reading-corner" className="art" />
        </div>
      </section>
    </>
  );
}
