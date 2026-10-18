import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {scryptSync} from 'node:crypto';
import {addDays,validDate,monthDays,schoolMonths,occurrences,onDay,validateEvent,toICS} from '../lib/calendar.ts';
import {readEvents,saveEvent} from '../lib/calendar-store.ts';
import {checkPassword,createSession,validSession,sameOrigin} from '../lib/calendar-auth.ts';
const fixture={title:'نشاط تجريبي',description:'تعلم، وتجربة; معًا\nسطر آخر',date:'2026-10-18',endDate:'2026-10-18',type:'نشاط',status:'confirmed',sample:false,allDay:true,startTime:'',endTime:'',grades:[7],location:'المختبر',attachmentUrl:'',attachmentLabel:'',repeat:'none',repeatUntil:''};
const stored={...fixture,id:'fixture',revision:1,updatedAt:'2026-10-18T08:00:00.000Z'};
test('calendar dates: leap years, Sunday grid and school-year boundaries',()=>{
 assert.equal(validDate('2024-02-29'),true);assert.equal(validDate('2026-02-29'),false);assert.equal(validDate('2026-13-01'),false);
 assert.equal(addDays('2026-12-31',1),'2027-01-01');assert.equal(monthDays('2026-10-18')[0],'2026-09-27');assert.equal(monthDays('2026-10-18').length,42);
 assert.equal(schoolMonths('2027-03-01')[0],'2026-09-01');assert.equal(schoolMonths('2027-03-01').at(-1),'2027-08-01');
});
test('multi-day and repeated events appear on all applicable dates including boundaries',()=>{
 const e={...stored,endDate:'2026-10-20',repeat:'weekly',repeatUntil:'2026-11-01'};
 const list=occurrences([e],'2026-10-19','2026-11-05');assert.equal(list.length,3);assert.equal(onDay(list,'2026-10-19').length,1);assert.equal(onDay(list,'2026-10-21').length,0);assert.equal(onDay(list,'2026-11-03').length,1);
});
test('validation rejects invalid ranges, links, dates, grades and unlimited repetition',()=>{
 for(const change of [{endDate:'2026-10-17'},{date:'2026-02-30'},{grades:[10]},{attachmentUrl:'javascript:alert(1)'},{allDay:false,startTime:'09:00',endTime:'08:00'},{repeat:'weekly',repeatUntil:'2029-01-01'},{status:'arbitrary'}])assert.throws(()=>validateEvent({...fixture,...change}));
 assert.equal(validateEvent({...fixture,grades:[7,7,8]}).grades.length,2);
});
test('calendar export excludes drafts, cancelled and samples; folds Arabic safely and uses exclusive all-day end',()=>{
 const data=toICS([stored,{...stored,id:'sample',sample:true},{...stored,id:'draft',status:'draft'},{...stored,id:'cancelled',status:'cancelled'}],'مدرستنا');
 assert.equal(data.match(/BEGIN:VEVENT/g).length,1);assert.ok(data.includes('DTEND;VALUE=DATE:20261019'));assert.ok(data.includes('DESCRIPTION:تعلم\\،')===false);
 for(const line of data.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);assert.ok(!data.includes('\ufffd'));
});
test('timed export honors Jerusalem winter and summer offsets',()=>{
 const summer={...stored,date:'2026-07-01',endDate:'2026-07-01',allDay:false,startTime:'09:00',endTime:'10:00'};
 const winter={...summer,id:'winter',date:'2026-12-01',endDate:'2026-12-01'};
 const data=toICS([summer,winter],'مدرستنا');assert.ok(data.includes('DTSTART:20260701T060000Z'));assert.ok(data.includes('DTSTART:20261201T070000Z'));
});
test('file storage survives rereads, serializes writes and prevents stale overwrites; sessions reject tampering',async()=>{
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'school-calendar-test-'));const previous=process.env.CALENDAR_DATA_DIR;process.env.CALENDAR_DATA_DIR=temp;
 try{
  const [a,b]=await Promise.all([saveEvent(fixture),saveEvent({...fixture,title:'موعد ثان'})]);
  const read=await readEvents();assert.ok(read.find(e=>e.id===a.id));assert.ok(read.find(e=>e.id===b.id));
  const updated=await saveEvent({...a,title:'عنوان معدل'},a.id,a.revision);assert.equal(updated.revision,2);
  await assert.rejects(()=>saveEvent(a,a.id,a.revision),e=>e.status===409);
  assert.equal((await readEvents()).find(e=>e.id===a.id).title,'عنوان معدل');
  const salt='test-salt',password='temporary-test-password-not-deployed';await fs.writeFile(path.join(temp,'auth.json'),JSON.stringify({salt,hash:scryptSync(password,salt,64).toString('hex'),secret:'test-secret-only'}));
  assert.equal(await checkPassword(password),true);assert.equal(await checkPassword('wrong'),false);const session=await createSession();assert.equal(await validSession(session),true);assert.equal(await validSession(session+'x'),false);assert.equal(await validSession('1.nonce.signature'),false);
 }finally{if(previous===undefined)delete process.env.CALENDAR_DATA_DIR;else process.env.CALENDAR_DATA_DIR=previous;if(path.dirname(temp)===os.tmpdir()&&path.basename(temp).startsWith('school-calendar-test-'))await fs.rm(temp,{recursive:true,force:true});}
});
test('writes require the exact site origin',()=>{
 assert.equal(sameOrigin(new Request('http://localhost:3101/api/calendar',{headers:{Origin:'http://localhost:3101'}})),true);
 assert.equal(sameOrigin(new Request('http://localhost:3101/api/calendar',{headers:{Origin:'https://other.example'}})),false);
 assert.equal(sameOrigin(new Request('http://localhost:3101/api/calendar')),false);
 assert.equal(sameOrigin(new Request('http://localhost:3101/api/calendar',{headers:{Origin:'http://127.0.0.1:3101',Host:'127.0.0.1:3101'}})),true);
});
