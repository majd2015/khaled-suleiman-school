import Link from "next/link";
import { requireRole, roleLabels } from "@/lib/auth";
import { signOut } from "@/app/login/actions";

export const metadata = { title: "لوحة الإدارة", robots: { index: false } };
export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "الرئيسية", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/news", label: "الأخبار", roles: ["admin", "editor"] },
  { href: "/admin/announcements", label: "الإعلانات", roles: ["admin", "editor"] },
  { href: "/admin/events", label: "الرزنامة", roles: ["admin", "editor"] },
  { href: "/admin/submissions", label: "مشاركات الطلاب", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/messages", label: "الرسائل", roles: ["admin", "editor"] },
  { href: "/admin/polls", label: "التصويت", roles: ["admin", "editor"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, name } = await requireRole(["admin", "editor", "teacher"]);
  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="container">
          <nav className="filters" style={{ margin: 0 }}>
            {links.filter((l) => l.roles.includes(role)).map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <form action={signOut} className="meta" style={{ margin: 0 }}>
            <span>{name} · {roleLabels[role]}</span>
            <button className="btn ghost" style={{ padding: "4px 14px" }}>خروج</button>
          </form>
        </div>
      </div>
      <section className="section">
        <div className="container">{children}</div>
      </section>
    </div>
  );
}
