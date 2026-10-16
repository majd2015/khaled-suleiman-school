// Read-only HTTP checks against a running local preview; no social post is sent.
import fs from "node:fs";
import assert from "node:assert/strict";
const base = process.argv[2] || "http://127.0.0.1:3100";
if (!["127.0.0.1","localhost"].includes(new URL(base).hostname)) throw new Error("Use a local preview URL");
const data=JSON.parse(fs.readFileSync(new URL("../content/articles.json",import.meta.url),"utf8"));
const routes=["/","/articles","/discover","/discover?subject=math","/grades","/grades/7","/grades/8","/grades/9","/school","/school/vision","/school/principal","/school/staff","/school/constitution","/school/contact","/news","/news/reading-week","/announcements","/calendar","/calendar?type=امتحان&grade=9","/newsletter","/newsletter/2026-09","/challenges","/challenges/number-pattern","/participate","/participate/vote","/participate/debate","/participate/reading","/participate/kind-word","/privacy","/app","/admin",...data.map(a=>"/articles/"+a.slug)];
const assets=[...data.flatMap(a=>a.cover.srcSet.map(s=>"/assets/articles/"+s.src.split("/").pop())),...data.filter(a=>a.diagram).map(a=>"/assets/diagrams/"+a.diagram.src.split("/").pop()),...fs.readdirSync(new URL("../public/assets/illustrations",import.meta.url)).filter(f=>f.endsWith(".webp")).map(f=>"/assets/illustrations/"+f)];
const failures=[];
for(let i=0;i<routes.length+assets.length;i+=6){const paths=[...routes,...assets].slice(i,i+6);await Promise.all(paths.map(async p=>{try{const r=await fetch(base+p);assert.equal(r.status,200,p);if(routes.includes(p)){const html=await r.text();assert.ok(html.includes('dir="rtl"'),p);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,p);}}catch(e){failures.push(String(e));}}));}
const calendar=await (await fetch(base+"/calendar.ics")).text();assert.ok(!calendar.includes("BEGIN:VEVENT"),"Demo dates must never be exported");
assert.equal((await fetch(base+"/api/social/publish",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"})).status,401);
assert.equal((await fetch(base+"/articles/does-not-exist")).status,404);
assert.equal(failures.length,0,failures.join("\n"));
console.log(JSON.stringify({pages:routes.length,assets:assets.length,rtl:true,singleH1:true,calendarExcludesDemo:true,unauthorizedPublishing:401,unknownArticle:404,failures},null,2));
