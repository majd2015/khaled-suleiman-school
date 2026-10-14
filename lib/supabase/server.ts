import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const isDbConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// عميل Supabase على الخادم بصلاحيات الزائر أو المستخدم المسجّل (حسب الكوكيز). RLS يحدد ما يُسمح به.
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // يُستدعى من Server Component حيث لا يمكن كتابة الكوكيز؛ middleware يتكفّل بالتحديث.
        }
      },
    },
  });
}

// عميل للقراءة العامة بدون كوكيز، حتى تبقى الصفحات العامة قابلة للتخزين المؤقت (ISR).
export function supabasePublic() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
