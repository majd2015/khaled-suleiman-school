import { site } from "@/site.config";
import { PageHead, Pending } from "@/components/ui";

export const metadata = { title: "كلمة المديرة" };

export default function Principal() {
  return (
    <>
      <PageHead title="كلمة المديرة" />
      <section className="section">
        <div className="container prose">
          <p><Pending>نص كلمة المديرة مع صورتها.</Pending></p>
          <p><strong>{site.principal.name}</strong><br />{site.principal.title}</p>
        </div>
      </section>
    </>
  );
}
