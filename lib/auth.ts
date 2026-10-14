import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, isDbConfigured } from "@/lib/prisma";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import type { Role } from "@/generated/prisma/client";

export type { Role };

export const roleLabels: Record<Role, string> = {
  admin: "مدير",
  editor: "محرر",
  teacher: "معلم",
};

export async function currentUser() {
  if (!isDbConfigured() || !process.env.SESSION_SECRET) return null;
  const userId = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const user = await db().user.findUnique({ where: { id: userId } });
  return user?.active ? user : null;
}

// يتأكد أن المستخدم مسجّل ولديه أحد الأدوار المطلوبة، وإلا يحوّله. يُستدعى في كل صفحة وعملية إدارة.
export async function requireRole(roles: Role[]) {
  if (!isDbConfigured() || !process.env.SESSION_SECRET) redirect("/login?e=setup");
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect("/login?e=forbidden");
  return { user, role: user.role, name: user.name || user.email };
}
