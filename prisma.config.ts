import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx scripts/seed.ts",
  },
  datasource: {
    // القيمة الاحتياطية فقط لـ `prisma generate` أثناء البناء؛ Coolify يعطي الرابط الحقيقي عند التشغيل.
    url: process.env.DATABASE_URL || "postgresql://school:school@127.0.0.1:5432/school?schema=public",
  },
});
