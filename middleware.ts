import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// حماية أولى: لوحة الإدارة لا تُفتح بدون جلسة صالحة. الصلاحيات نفسها تُفحص في كل صفحة وعملية.
export async function middleware(request: NextRequest) {
  if (!process.env.SESSION_SECRET) return NextResponse.redirect(new URL("/login?e=setup", request.url));
  const userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!userId) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
