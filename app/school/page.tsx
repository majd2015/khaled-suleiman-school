import Link from "next/link";
import { site } from "@/site.config";
import { PageHead, Pending } from "@/components/ui";

export const metadata = { title: "عن المدرسة" };

const links = [
  { href: "/school/principal", title: "كلمة المديرة" },
  { href: "/school/vision", title: "الرؤية والرسالة" },
  { href: "/school/constitution", title: "دستور المدرسة" },
  { href: "/school/staff", title: "الطاقم" },
  { href: "/school/contact", title: "اتصل بنا" },
];

export default function School() {
  return (
    <>
      <PageHead title="عن المدرسة" subtitle={site.grades} />
      <section className="section">
        <div className="container">
          <div className="prose">
            <p>
              <Pending>نبذة عن المدرسة وتاريخها، ولماذا سُمّيت على اسم خالد سليمان.</Pending>
            </p>
          </div>
          <div className="grid" style={{ marginTop: 24 }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="card link" style={{ color: "inherit" }}>
                <h3>{l.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
