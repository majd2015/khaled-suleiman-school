import { isDbConfigured, supabasePublic } from "@/lib/supabase/server";

export type Approved = { id: string; content: Record<string, string>; name: string | null };

// المشاركات التي وافق عليها معلّم. الاسم يظهر فقط إذا اختار الطالب ذلك.
export async function getApproved(kind: "debate" | "kind_word" | "reading", limit = 30): Promise<Approved[]> {
  if (!isDbConfigured()) return [];
  const { data } = await supabasePublic()
    .from("submissions")
    .select("id,content,show_name,author_name")
    .eq("kind", kind)
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r) => ({ id: r.id, content: r.content, name: r.show_name ? r.author_name : null }));
}
