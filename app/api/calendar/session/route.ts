import {NextRequest,NextResponse} from "next/server";
import {checkPassword,createSession,sessionCookie,sameOrigin,loginLimited,failedLogin} from "@/lib/calendar-auth";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:NextRequest) {
  if(!sameOrigin(request))return NextResponse.json({error:"مصدر الطلب غير صالح."},{status:403});
  if(loginLimited())return NextResponse.json({error:"محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة."},{status:429,headers:{"Retry-After":"60"}});
  const body=await request.text();
  if(body.length>1000)return NextResponse.json({error:"بيانات الدخول غير صالحة."},{status:400});
  let password;try {password=JSON.parse(body).password;}catch{return NextResponse.json({error:"بيانات الدخول غير صالحة."},{status:400});}
  if(typeof password!=="string"||!await checkPassword(password)){failedLogin();return NextResponse.json({error:"كلمة المرور غير صحيحة."},{status:401});}
  const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
  response.cookies.set(sessionCookie,await createSession(),{httpOnly:true,sameSite:"strict",secure:new URL(request.headers.get("origin")!).protocol==="https:",path:"/",maxAge:8*60*60});
  return response;
}
export async function DELETE(request:NextRequest) {
  if(!sameOrigin(request))return NextResponse.json({error:"مصدر الطلب غير صالح."},{status:403});
  const response=NextResponse.json({ok:true});response.cookies.set(sessionCookie,"",{httpOnly:true,sameSite:"strict",path:"/",maxAge:0});return response;
}
