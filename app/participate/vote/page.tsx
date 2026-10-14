import { PageHead } from "@/components/ui";
import Poll from "@/components/Poll";

export const metadata = { title: "التصويت" };

export default function Vote() {
  return (
    <>
      <PageHead title="التصويت" subtitle="رأيك يهمّنا" />
      <section className="section">
        <div className="container prose">
          <Poll id="trip-2026" question="إلى أين تفضّل أن تكون الرحلة السنوية؟ (استطلاع تجريبي)" options={["متحف العلوم", "محمية طبيعية", "مدينة تاريخية"]} />
        </div>
      </section>
    </>
  );
}
