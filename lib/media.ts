import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// الصور المرفوعة تُحفظ على السيرفر (مجلد دائم في Coolify) وتُعرض عبر /media/...
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "uploads");
export const MAX_IMAGE = 5 * 1024 * 1024;

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isAllowedImage(file: File) {
  return file.size > 0 && file.size <= MAX_IMAGE && file.type in TYPES;
}

export async function saveImage(file: File, folder = "news"): Promise<string> {
  const name = `${randomUUID()}.${TYPES[file.type]}`;
  const dir = path.join(UPLOAD_DIR, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${folder}/${name}`;
}
