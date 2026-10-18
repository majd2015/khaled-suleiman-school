import { promises as fs } from "node:fs";
import path from "node:path";
import { createHmac, timingSafeEqual, scrypt as nodeScrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { calendarDirectory } from "./calendar-store.ts";
const scrypt=promisify(nodeScrypt);
export const sessionCookie="school-calendar-session";
type Config={salt:string;hash:string;secret:string};
async function config():Promise<Config|null> {
  try {return JSON.parse(await fs.readFile(path.join(calendarDirectory(),"auth.json"),"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return null;throw e;}
}
export async function configured() {return !!(await config());}
const safeEqual=(a:string,b:string)=>{const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);};
export async function checkPassword(password:string) {const c=await config();if(!c||password.length>256)return false;const hash=await scrypt(password,c.salt,64) as Buffer;return safeEqual(hash.toString("hex"),c.hash);}
export async function createSession(){const c=await config();if(!c)throw new Error("Admin not configured");const value=`${Date.now()+8*60*60*1000}.${randomBytes(24).toString("hex")}`;return value+"."+createHmac("sha256",c.secret).update(value).digest("hex");}
export async function validSession(token:string|undefined) {if(!token||token.length>300)return false;const c=await config();if(!c)return false;const [expiry,nonce,signature,...extra]=token.split(".");if(extra.length||!expiry||!nonce||!signature||!/^\d+$/.test(expiry)||Number(expiry)<Date.now()||Number(expiry)>Date.now()+8*60*60*1000)return false;return safeEqual(signature,createHmac("sha256",c.secret).update(expiry+"."+nonce).digest("hex"));}
export function sameOrigin(request:Request){
  const value=request.headers.get("origin");if(!value)return false;
  try{const origin=new URL(value),target=new URL(request.url);const host=request.headers.get("host")||target.host;
    // Next can reconstruct request.url using the listening hostname. Browser Host
    // retains the actual origin, including its port; do not trust forwarded hosts.
    return ["http:","https:"].includes(origin.protocol)&&origin.host===host&&(target.protocol!=="https:"||origin.protocol==="https:");
  }catch{return false;}
}
const failures:number[]=[];
export function loginLimited(){const cutoff=Date.now()-60000;while(failures[0]<cutoff) failures.shift();return failures.length>=10;}
export function failedLogin(){failures.push(Date.now());}
