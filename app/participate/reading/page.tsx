import Illustration from "@/components/Illustration";
import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";

export const metadata = { title: "نادي القراءة" };

export default function Reading() {
  return (
    <>
      <PageHead title="نادي القراءة" subtitle="أوصِ زملاءك بكتاب" />
      <section className="section">
        <div className="container split">
          <div>
          <SubmitForm fields={[
            { name: "book", label: "اسم الكتاب" },
            { name: "author", label: "المؤلف" },
            { name: "why", label: "لماذا أنصح به؟", type: "textarea" },
          ]} />
          </div>
          <Illustration id="reading-corner" className="art" />
        </div>
      </section>
    </>
  );
}
