import {events} from "@/content/data";
import {site} from "@/site.config";
export const dynamic="force-static";
export function GET() {
 const date=(iso:string)=>iso.replaceAll("-","");
 const escape=(text:string)=>text.replaceAll("\\","\\\\").replaceAll("\n","\\n").replaceAll(",","\\,").replaceAll(";","\\;");
 const lines=["BEGIN:VCALENDAR","VERSION:2.0","CALSCALE:GREGORIAN","PRODID:-//Khaled Suleiman School//Calendar//AR","X-WR-CALNAME:"+escape(site.name),
 ...events.filter(e=>e.confirmed&&!e.sample).flatMap(e=>["BEGIN:VEVENT","UID:"+e.id+"@khaled-suleiman-school","DTSTAMP:"+date(e.date)+"T000000Z","DTSTART;VALUE=DATE:"+date(e.date),"SUMMARY:"+escape(e.title),"CATEGORIES:"+escape(e.type),"END:VEVENT"]),"END:VCALENDAR"];
 return new Response(lines.join("\r\n")+"\r\n",{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'attachment; filename="school-calendar.ics"'}});
}
