import {cookies} from "next/headers";
import CalendarWorkspace from "@/components/calendar/CalendarWorkspace";
import CalendarLogin from "@/components/calendar/CalendarLogin";
import {readEvents} from "@/lib/calendar-store";
import {sessionCookie,validSession,configured} from "@/lib/calendar-auth";
import {todayInSchool} from "@/lib/calendar";
import "@/app/calendar/calendar.css";
export const metadata={title:"إدارة الرزنامة",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function CalendarAdmin({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  if(!await validSession((await cookies()).get(sessionCookie)?.value))return <CalendarLogin configured={await configured()}/>;
  return <CalendarWorkspace initialEvents={await readEvents()} initialQuery={await searchParams} today={todayInSchool()} admin/>;
}
