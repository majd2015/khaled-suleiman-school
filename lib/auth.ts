import { redirect } from "next/navigation";
import { isDbConfigured, supabaseServer } from "@/lib/supabase/server";

export type Role = "admin" | "editor" | "teacher";

export const roleLabels: Record<Role, string> = {
  admin: "مدير",
  editor: "محرر",
  teacher: "معلم",
};

// يتأكد أن المستخدم مسجّل ولديه أحد الأدوار المطلوبة، وإلا يحوّله.
export async function requireRole(roles: Role[]) {
  if (!isDbConfigured()) redirect("/login?e=setup");
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).single();
  const role = profile?.role as Role | null;
  if (!role || !roles.includes(role)) redirect("/login?e=forbidden");
  return { supabase, user, role, name: profile?.full_name || profile?.email || "" };
}
