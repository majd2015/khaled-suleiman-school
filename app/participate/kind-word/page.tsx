import { PageHead } from "@/components/ui";
import SubmitForm from "@/components/SubmitForm";

export const metadata = { title: "الكلمة الطيبة صدقة" };

export default function KindWord() {
  return (
    <>
      <PageHead title="الكلمة الطيبة صدقة" subtitle="اكتب رسالة شكر لزميل أو معلّم، تُعلَّق على شجرة الشعبة دون اسم" />
      <section className="section">
        <div className="container prose">
          <SubmitForm submitLabel="علّق الرسالة" fields={[
            { name: "section", label: "الشعبة", type: "select", options: ["سابع 1", "سابع 2", "سابع 3", "ثامن 1", "ثامن 2", "ثامن 3", "تاسع 1", "تاسع 2", "تاسع 3"] },
            { name: "message", label: "رسالتي", type: "textarea" },
          ]} />
        </div>
      </section>
    </>
  );
}
