import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
const data = process.env.CALENDAR_DATA_DIR || path.resolve(".calendar-data");
const destination = process.argv[2];
if (!destination || !path.isAbsolute(destination))
  throw new Error("Pass an absolute private credentials output path.");
await fs.mkdir(data, { recursive: true });
for (const target of [destination, path.join(data, "auth.json")]) {
  try {
    await fs.access(target);
    throw new Error(
      "Setup will not overwrite existing credentials or an existing administrator.",
    );
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}
const password = randomBytes(24).toString("base64url"),
  salt = randomBytes(24).toString("hex");
const auth = {
  salt,
  hash: scryptSync(password, salt, 64).toString("hex"),
  secret: randomBytes(48).toString("hex"),
};
await fs.writeFile(path.join(data, "auth.json"), JSON.stringify(auth), {
  flag: "wx",
  mode: 0o600,
});
await fs.writeFile(
  destination,
  `إدارة رزنامة مدرسة خالد سليمان\n\nالرابط المحلي: http://127.0.0.1:3101/admin/calendar\nكلمة المرور: ${password}\n\nهذه البيانات خاصة بالإدارة؛ لا ترفعها إلى GitHub ولا تشاركها مع الطلاب.\nتُحفظ كلمة المرور مشفّرة بالتجزئة على الخادم، وتُحفظ المواعيد في .calendar-data/events.json.\nاحتفظ بنسخة آمنة من بيانات الإدارة والمواعيد.\n`,
  { flag: "wx", mode: 0o600 },
);
console.log(
  "Calendar administrator configured. Credentials saved privately; no password printed.",
);
