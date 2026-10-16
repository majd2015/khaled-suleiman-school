import { PageHead } from "@/components/ui";
import LoginForm from "./LoginForm";

export const metadata = { title: "دخول الإدارة", robots: { index: false } };

const notes: Record<string, string> = {
  setup: "لوحة الإدارة غير مفعّلة بعد: تحتاج DATABASE_URL و SESSION_SECRET على السيرفر (انظر DEPLOYMENT.md).",
  forbidden: "حسابك لا يملك صلاحية لهذه الصفحة. اطلب من مدير الموقع إضافتك.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <>
      <PageHead title="دخول الإدارة" subtitle="للطاقم المخوَّل فقط" />
      <section className="section">
        <div className="container prose">
          {e && notes[e] && <p className="card" style={{ marginBottom: 16 }}>{notes[e]}</p>}
          <LoginForm />
        </div>
      </section>
    </>
  );
}
