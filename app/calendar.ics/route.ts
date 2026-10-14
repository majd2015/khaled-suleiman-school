import { events } from "@/content/data";
import { site } from "@/site.config";

export const dynamic = "force-static";

export function GET() {
  const d = (iso: string) => iso.replaceAll("-", "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.shortName}//calendar//AR`,
    `X-WR-CALNAME:${site.name}`,
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.id}@school`,
      `DTSTART;VALUE=DATE:${d(e.date)}`,
      `SUMMARY:${e.title}`,
      `CATEGORIES:${e.type}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return new Response(lines.join("\r\n"), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
