import CalendarWorkspace from "@/components/calendar/CalendarWorkspace";
import { readEvents } from "@/lib/calendar-store";
import { isPublic, todayInSchool } from "@/lib/calendar";
import "./calendar.css";
export const metadata = { title: "الرزنامة المدرسية" };
export const dynamic = "force-dynamic";
export default async function Calendar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CalendarWorkspace
      initialEvents={(await readEvents()).filter(isPublic)}
      initialQuery={await searchParams}
      today={todayInSchool()}
      admin={false}
    />
  );
}
