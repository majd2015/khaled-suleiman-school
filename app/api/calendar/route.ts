import { NextRequest, NextResponse } from "next/server";
import { readEvents, saveEvent, StoreError } from "@/lib/calendar-store";
import { isPublic } from "@/lib/calendar";
import { sessionCookie, validSession, sameOrigin } from "@/lib/calendar-auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
export async function GET(request: NextRequest) {
  const admin = await validSession(request.cookies.get(sessionCookie)?.value);
  return NextResponse.json(
    { events: (await readEvents()).filter((e) => admin || isPublic(e)), admin },
    { headers },
  );
}
async function mutate(request: NextRequest, editing: boolean) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "تعذّر التحقق من مصدر الطلب." },
      { status: 403, headers },
    );
  if (!(await validSession(request.cookies.get(sessionCookie)?.value)))
    return NextResponse.json(
      { error: "انتهت جلسة الإدارة. سجّل الدخول مجددًا." },
      { status: 401, headers },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      { error: "صيغة الطلب غير صالحة." },
      { status: 415, headers },
    );
  const body = await request.text();
  if (body.length > 24000)
    return NextResponse.json(
      { error: "الموعد أطول من الحد المسموح." },
      { status: 413, headers },
    );
  try {
    const input = JSON.parse(body);
    if (
      editing &&
      (typeof input.id !== "string" || !Number.isInteger(input.revision))
    )
      throw new StoreError("بيانات التعديل غير صالحة.");
    const event = await saveEvent(
      input,
      editing ? input.id : undefined,
      editing ? input.revision : undefined,
    );
    return NextResponse.json(
      { event },
      { status: editing ? 200 : 201, headers },
    );
  } catch (e) {
    if (e instanceof StoreError)
      return NextResponse.json(
        { error: e.message },
        { status: e.status, headers },
      );
    if (e instanceof SyntaxError)
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة." },
        { status: 400, headers },
      );
    if ((e as NodeJS.ErrnoException).code) {
      console.error(
        "Calendar storage write failed",
        (e as NodeJS.ErrnoException).code,
      );
      return NextResponse.json(
        {
          error: "تعذّر حفظ الموعد على الخادم. لم يُحفظ التغيير؛ حاول مجددًا.",
        },
        { status: 500, headers },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "راجع بيانات الموعد." },
      { status: 400, headers },
    );
  }
}
export function POST(request: NextRequest) {
  return mutate(request, false);
}
export function PUT(request: NextRequest) {
  return mutate(request, true);
}
