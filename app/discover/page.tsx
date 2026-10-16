import { PageHead } from "@/components/ui";
import ScienceLab from "@/components/ScienceLab";
import "./lab.css";
export const metadata = {
  title: "المختبر التفاعلي",
  description: "استكشف خمسة مجسّمات تعليمية رمزية، من الرياضيات إلى الأحياء.",
};
export default async function Discover({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  return (
    <>
      <PageHead
        title="فكرة تراها من كل زاوية."
        subtitle="حرّك المجسّم، غيّر منظورك، واسأل سؤالًا جديدًا."
      />
      <section className="section">
        <div className="container">
          <ScienceLab initialSubject={subject || "physics"} />
        </div>
      </section>
    </>
  );
}
