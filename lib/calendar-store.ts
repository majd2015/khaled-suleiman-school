import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { events as seed } from "../content/data.ts";
import { validateEvent, type SchoolEvent } from "./calendar.ts";

export function calendarDirectory() { return process.env.CALENDAR_DATA_DIR || path.join(process.cwd(),".calendar-data"); }
export class StoreError extends Error { status:number; constructor(message:string,status=400){super(message);this.status=status;} }
export async function readEvents():Promise<SchoolEvent[]> {
  try {
    const data=JSON.parse(await fs.readFile(path.join(calendarDirectory(),"events.json"),"utf8"));
    if(data.version!==1||!Array.isArray(data.events)) throw new Error("Calendar storage format invalid");
    return data.events;
  }catch(error){
    if((error as NodeJS.ErrnoException).code!=="ENOENT") throw error;
    return seed.map(e=>({...e,revision:1,description:"موعد تجريبي لعرض طريقة عمل الرزنامة. تعتمد المدرسة المواعيد الرسمية لاحقًا.",endDate:e.date,allDay:true,startTime:"",endTime:"",status:e.confirmed?"confirmed":"proposed",sample:!!e.sample,grades:e.grades||[],location:"",attachmentUrl:"",attachmentLabel:"",repeat:"none",repeatUntil:"",updatedAt:"2026-10-18T00:00:00.000Z"}));
  }
}
export async function saveEvent(input:unknown,id?:string,revision?:number):Promise<SchoolEvent> {
  const value=validateEvent(input),dir=calendarDirectory();
  await fs.mkdir(dir,{recursive:true});
  // Exclusive filesystem lock also serializes writes across Next server workers.
  const lock=path.join(dir,"write.lock");let handle;
  for(let i=0;i<30;i++) {try {handle=await fs.open(lock,"wx");break;}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw e;await new Promise(r=>setTimeout(r,100));}}
  if(!handle) throw new StoreError("هناك عملية حفظ أخرى. أعد المحاولة بعد لحظات.",503);
  const temp=path.join(dir,`events-${randomUUID()}.tmp`);
  try {
    const events=await readEvents(),index=id?events.findIndex(e=>e.id===id):-1;
    if(id&&index===-1)throw new StoreError("الموعد غير موجود.",404);
    if(index>=0&&events[index].revision!==revision)throw new StoreError("عُدّل هذا الموعد من جلسة أخرى. حدّث الصفحة قبل الحفظ.",409);
    if(index<0&&events.length>=2000)throw new StoreError("وصلت الرزنامة إلى الحد الأقصى للمواعيد.",400);
    const event:SchoolEvent={...value,id:id||randomUUID(),revision:index>=0?events[index].revision+1:1,updatedAt:new Date().toISOString()};
    if(index>=0) events[index]=event;else events.push(event);
    await fs.writeFile(temp,JSON.stringify({version:1,events},null,2),{encoding:"utf8",mode:0o600});
    await fs.rename(temp,path.join(dir,"events.json"));
    return event;
  }finally{await fs.rm(temp,{force:true});await handle.close();await fs.unlink(lock);}
}
