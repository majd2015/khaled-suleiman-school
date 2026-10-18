import {readEvents} from "@/lib/calendar-store";
import {toICS} from "@/lib/calendar";
import {site} from "@/site.config";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function GET(request:Request) {
  const id=new URL(request.url).searchParams.get("event");
  const events=(await readEvents()).filter(e=>(!id||e.id===id)&&e.status==="confirmed"&&!e.sample);
  if(id&&!events.length)return new Response("هذا الموعد غير متاح للتصدير.",{status:404});
  return new Response(toICS(events,site.name),{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'attachment; filename="school-calendar.ics"',"Cache-Control":"no-store"}});
}
