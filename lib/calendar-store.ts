import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { events as seed } from "../content/data.ts";
import { validateEvent, type SchoolEvent } from "./calendar.ts";

export function calendarDirectory() { return process.env.CALENDAR_DATA_DIR || path.join(process.cwd(),".calendar-data"); }
export class StoreError extends Error { status:number; constructor(message:string,status=400){super(message);this.status=status;} }
// Keep snapshots private beside the live store, never in source control/public assets.
async function backupEvents(dir:string,events:SchoolEvent[]) {
  const backups=path.join(dir,"backups");
  await fs.mkdir(backups,{recursive:true,mode:0o700});
  const name=`events-${new Date().toISOString().replace(/[:.]/g,"-")}-${randomUUID()}.json`;
  await fs.writeFile(path.join(backups,name),JSON.stringify({version:1,events},null,2),{flag:"wx",encoding:"utf8",mode:0o600});
  // Prune only snapshots created by this function, while holding the store lock.
  const snapshots=(await fs.readdir(backups)).filter(n=>/^events-\d{4}-\d{2}-\d{2}T[\dTZ-]+-[a-f0-9-]{36}\.json$/.test(n)).sort();
  for(const old of snapshots.slice(0,-10))await fs.unlink(path.join(backups,old));
}
export async function readEvents():Promise<SchoolEvent[]> {
  try {
    const data=JSON.parse(await fs.readFile(path.join(calendarDirectory(),"events.json"),"utf8"));
    if(data.version!==1||!Array.isArray(data.events)) throw new Error("Calendar storage format invalid");
    const ids=new Set<string>();
    for(const event of data.events){
      validateEvent(event);
      if(typeof event.id!=="string"||!event.id||ids.has(event.id)||!Number.isSafeInteger(event.revision)||event.revision<1||typeof event.updatedAt!=="string"||!Number.isFinite(Date.parse(event.updatedAt)))throw new Error("Calendar storage record invalid");
      ids.add(event.id);
    }
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
    // If backup fails, leave the live data untouched and fail the save.
    await backupEvents(dir,events);
    const event:SchoolEvent={...value,id:id||randomUUID(),revision:index>=0?events[index].revision+1:1,updatedAt:new Date().toISOString()};
    if(index>=0) events[index]=event;else events.push(event);
    await fs.writeFile(temp,JSON.stringify({version:1,events},null,2),{encoding:"utf8",mode:0o600});
    await fs.rename(temp,path.join(dir,"events.json"));
    return event;
  }finally{await fs.rm(temp,{force:true});await handle.close();await fs.unlink(lock);}
}
