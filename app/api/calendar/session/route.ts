import { NextRequest, NextResponse } from "next/server";
import {
  checkPassword,
  createSession,
  sessionCookie,
  sameOrigin,
  loginIdentity,
  clientCookie,
} from "@/lib/calendar-auth";
import { calendarLoginLimiter } from "@/lib/calendar-login-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "مصدر الطلب غير صالح." },
      { status: 403, headers },
    );
  const body = await request.text();
  if (body.length > 1000)
    return NextResponse.json(
      { error: "بيانات الدخول غير صالحة." },
      { status: 400, headers },
    );
  let password: unknown;
  try {
    password = JSON.parse(body).password;
  } catch {
    return NextResponse.json(
      { error: "بيانات الدخول غير صالحة." },
      { status: 400, headers },
    );
  }
  if (typeof password !== "string" || password.length > 256)
    return NextResponse.json(
      { error: "بيانات الدخول غير صالحة." },
      { status: 400, headers },
    );

  let identity;
  try {
    identity = await loginIdentity(
      request,
      request.cookies.get(clientCookie)?.value,
    );
  } catch {
    return NextResponse.json(
      { error: "إعداد الدخول غير مكتمل على الخادم. تواصل مع مسؤول الموقع." },
      { status: 503, headers },
    );
  }
  const secure = new URL(request.headers.get("origin")!).protocol === "https:";
  const respond = (
    data: object,
    status: number,
    extra: Record<string, string> = {},
  ) => {
    const response = NextResponse.json(data, {
      status,
      headers: { ...headers, ...extra },
    });
    response.cookies.set(clientCookie, identity.token, {
      httpOnly: true,
      sameSite: "strict",
      secure,
      path: "/",
      maxAge: 86400,
    });
    return response;
  };
  const attempt = calendarLoginLimiter.consume(identity.key);
  if (!attempt.allowed)
    return respond(
      {
        error:
          "محاولات كثيرة من هذا المتصفح أو الاتصال. انتظر دقيقة ثم أعد المحاولة.",
      },
      429,
      { "Retry-After": String(attempt.retryAfter) },
    );
  if (!(await checkPassword(password)))
    return respond({ error: "كلمة المرور غير صحيحة." }, 401);

  calendarLoginLimiter.clear(identity.key);
  const response = respond({ ok: true }, 200);
  response.cookies.set(sessionCookie, await createSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "مصدر الطلب غير صالح." },
      { status: 403, headers },
    );
  const response = NextResponse.json({ ok: true }, { headers });
  response.cookies.set(sessionCookie, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
