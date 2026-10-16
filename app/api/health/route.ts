import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ ok: true, database: "not-configured" });
  try {
    await db().$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "ok" });
  } catch {
    return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 });
  }
}
