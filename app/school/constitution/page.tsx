import { PageHead, Pending } from "@/components/ui";

export const metadata = { title: "دستور المدرسة" };

export default function Constitution() {
  return (
    <>
      <PageHead title="دستور المدرسة" subtitle="الحقوق والواجبات والأنظمة" />
      <section className="section">
        <div className="container prose">
          <p><Pending>بنود دستور المدرسة كما ترسلها الإدارة.</Pending></p>
        </div>
      </section>
    </>
  );
}
