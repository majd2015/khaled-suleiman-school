export const eventTypes = ["امتحان", "نشاط", "عطلة", "عام"] as const;
export type EventType = (typeof eventTypes)[number];
export type EventStatus = "draft" | "proposed" | "confirmed" | "cancelled";
export type SchoolEvent = {
  id: string;
  revision: number;
  title: string;
  description: string;
  date: string;
  endDate: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  type: EventType;
  status: EventStatus;
  sample: boolean;
  grades: number[];
  location: string;
  attachmentUrl: string;
  attachmentLabel: string;
  repeat: "none" | "weekly";
  repeatUntil: string;
  updatedAt: string;
};
export type Occurrence = SchoolEvent & {
  occurrenceDate: string;
  occurrenceEnd: string;
  key: string;
};
export const statusLabels: Record<EventStatus, string> = {
  draft: "مسودة",
  proposed: "مقترح",
  confirmed: "مؤكّد",
  cancelled: "ملغى",
};
export const tones: Record<EventType, string> = {
  امتحان: "blue",
  نشاط: "violet",
  عطلة: "cyan",
  عام: "orange",
};
export const months = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول",
];
export const weekdays = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^20\d{2}-\d{2}-\d{2}$/.test(value))
    return false;
  const d = new Date(value + "T12:00:00Z");
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
export function addDays(date: string, days: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function dayOfWeek(date: string) {
  return new Date(date + "T12:00:00Z").getUTCDay();
}
export function monthStart(date: string) {
  return date.slice(0, 7) + "-01";
}
export function moveMonth(date: string, n: number) {
  const d = new Date(monthStart(date) + "T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
}
export function monthDays(date: string) {
  const start = monthStart(date);
  const first = addDays(start, -dayOfWeek(start));
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
}
export function schoolYear(date: string) {
  return Number(date.slice(0, 4)) - (Number(date.slice(5, 7)) < 9 ? 1 : 0);
}
export function schoolMonths(date: string) {
  return Array.from({ length: 12 }, (_, i) =>
    moveMonth(`${schoolYear(date)}-09-01`, i),
  );
}
export function todayInSchool() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function dateLabel(date: string, withDay = false) {
  return `${withDay ? weekdays[dayOfWeek(date)] + "، " : ""}${Number(date.slice(8))} ${months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;
}
export function monthLabel(date: string) {
  return `${months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;
}
export function normalise(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670ـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLowerCase();
}
export function occurrences(
  events: SchoolEvent[],
  from: string,
  until: string,
): Occurrence[] {
  const result: Occurrence[] = [];
  for (const e of events) {
    let date = e.date,
      end = e.endDate;
    for (let count = 0; count < 54; count++) {
      if (date > until) break;
      if (end >= from)
        result.push({
          ...e,
          occurrenceDate: date,
          occurrenceEnd: end,
          key: e.id + ":" + date,
        });
      if (e.repeat !== "weekly" || addDays(date, 7) > e.repeatUntil) break;
      date = addDays(date, 7);
      end = addDays(end, 7);
    }
  }
  return result.sort(
    (a, b) =>
      a.occurrenceDate.localeCompare(b.occurrenceDate) ||
      Number(b.allDay) - Number(a.allDay) ||
      a.startTime.localeCompare(b.startTime) ||
      a.title.localeCompare(b.title, "ar"),
  );
}
export function onDay(events: Occurrence[], date: string) {
  return events.filter(
    (e) => e.occurrenceDate <= date && e.occurrenceEnd >= date,
  );
}
export function isPublic(e: SchoolEvent) {
  return e.status !== "draft";
}
export function validateEvent(
  input: unknown,
): Omit<SchoolEvent, "id" | "revision" | "updatedAt"> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("بيانات الموعد غير صالحة.");
  const v = input as Record<string, unknown>;
  const labels: Record<string, string> = {
    title: "عنوان الموعد",
    description: "التفاصيل",
    date: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    repeatUntil: "نهاية التكرار",
    location: "المكان",
    attachmentUrl: "رابط المرفق",
    attachmentLabel: "اسم المرفق",
  };
  function str(key: string, max: number, required = false) {
    const value = v[key];
    if (
      typeof value !== "string" ||
      value.length > max ||
      (required && !value.trim())
    )
      throw new Error(`راجع حقل ${labels[key] || key}.`);
    return value.trim();
  }
  const title = str("title", 160, true),
    description = str("description", 4000),
    date = str("date", 10, true),
    endDate = str("endDate", 10, true);
  if (
    !validDate(date) ||
    !validDate(endDate) ||
    endDate < date ||
    endDate > addDays(date, 366)
  )
    throw new Error("اختر تاريخ بداية ونهاية صحيحين؛ الحد الأقصى سنة.");
  if (!eventTypes.includes(v.type as EventType))
    throw new Error("اختر نوع الموعد.");
  if (
    !["draft", "proposed", "confirmed", "cancelled"].includes(String(v.status))
  )
    throw new Error("اختر حالة الموعد.");
  if (typeof v.sample !== "boolean" || typeof v.allDay !== "boolean")
    throw new Error("إعدادات الموعد غير صالحة.");
  let startTime = str("startTime", 5),
    endTime = str("endTime", 5);
  if (!v.allDay) {
    const time = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (
      !time.test(startTime) ||
      !time.test(endTime) ||
      (date === endDate && endTime <= startTime)
    )
      throw new Error("وقت النهاية يجب أن يلي وقت البداية.");
  } else {
    startTime = "";
    endTime = "";
  }
  if (!Array.isArray(v.grades) || v.grades.some((g) => ![7, 8, 9].includes(g)))
    throw new Error("اختر الصفوف السابع أو الثامن أو التاسع.");
  const attachmentUrl = str("attachmentUrl", 1000),
    attachmentLabel = str("attachmentLabel", 100);
  if (attachmentUrl) {
    try {
      const u = new URL(attachmentUrl);
      if (u.protocol !== "https:" || u.username || u.password)
        throw new Error();
    } catch {
      throw new Error("رابط المرفق يجب أن يبدأ بـ https://");
    }
  }
  const repeat = v.repeat;
  if (repeat !== "none" && repeat !== "weekly")
    throw new Error("التكرار غير صالح.");
  const repeatUntil = repeat === "weekly" ? str("repeatUntil", 10, true) : "";
  if (
    repeat === "weekly" &&
    (!validDate(repeatUntil) ||
      repeatUntil < addDays(date, 7) ||
      repeatUntil > addDays(date, 364) ||
      endDate >= addDays(date, 7))
  )
    throw new Error(
      "التكرار الأسبوعي: اختر نهاية بين أسبوع وسنة، ومدة الموعد أقل من أسبوع.",
    );
  return {
    title,
    description,
    date,
    endDate,
    allDay: v.allDay,
    startTime,
    endTime,
    type: v.type as EventType,
    status: v.status as EventStatus,
    sample: v.sample,
    grades: [...new Set(v.grades as number[])],
    location: str("location", 200),
    attachmentUrl,
    attachmentLabel,
    repeat,
    repeatUntil,
  };
}
export function toICS(events: SchoolEvent[], name: string) {
  const escape = (s: string) =>
    s
      .replaceAll("\\", "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const stamp = (s: string) => s.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const date = (s: string) => s.replaceAll("-", "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//Khaled Suleiman School//Calendar//AR",
    "X-WR-CALNAME:" + escape(name),
    "X-WR-TIMEZONE:Asia/Jerusalem",
  ];
  // UTC timestamps preserve Jerusalem daylight-saving time, including recurring dates.
  const localUTC = (d: string, t: string) => {
    const wall = Date.parse(`${d}T${t}:00Z`);
    let utc = wall;
    for (let i = 0; i < 3; i++) {
      const p = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jerusalem",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(utc));
      const get = (k: string) => p.find((x) => x.type === k)!.value;
      const shown = Date.parse(
        `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`,
      );
      utc += wall - shown;
    }
    return stamp(new Date(utc).toISOString());
  };
  for (const e of occurrences(
    events.filter((e) => e.status === "confirmed" && !e.sample),
    "2000-01-01",
    "2099-12-31",
  )) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}-${e.occurrenceDate}@khaled-suleiman-school`,
      `DTSTAMP:${stamp(e.updatedAt)}`,
      `LAST-MODIFIED:${stamp(e.updatedAt)}`,
      `SEQUENCE:${e.revision}`,
    );
    if (e.allDay)
      lines.push(
        `DTSTART;VALUE=DATE:${date(e.occurrenceDate)}`,
        `DTEND;VALUE=DATE:${date(addDays(e.occurrenceEnd, 1))}`,
      );
    else
      lines.push(
        `DTSTART:${localUTC(e.occurrenceDate, e.startTime)}`,
        `DTEND:${localUTC(e.occurrenceEnd, e.endTime)}`,
      );
    lines.push(
      "SUMMARY:" + escape(e.title),
      "DESCRIPTION:" + escape(e.description),
      "LOCATION:" + escape(e.location),
      "CATEGORIES:" + escape(e.type),
      "STATUS:CONFIRMED",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return (
    lines
      .map((line) => {
        const chunks: string[] = [];
        let part = "",
          size = 0;
        for (const c of line) {
          const bytes = new TextEncoder().encode(c).length;
          if (size + bytes > 74) {
            chunks.push(part);
            part = " ";
            size = 1;
          }
          part += c;
          size += bytes;
        }
        chunks.push(part);
        return chunks.join("\r\n");
      })
      .join("\r\n") + "\r\n"
  );
}
