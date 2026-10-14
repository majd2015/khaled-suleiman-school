// يعمل عند كل تشغيل للحاوية بعد prisma db push. آمن للتكرار: لا يضيف شيئًا موجودًا.
// 1) ينشئ أول حساب مدير من ADMIN_EMAIL و ADMIN_PASSWORD إذا لم يوجد أي مدير.
// 2) مع SEED_DEMO=1 فقط: ينسخ المحتوى التجريبي من content/data.ts إذا كانت الجداول فارغة.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { announcements, events, news } from "../content/data";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function seedAdmin() {
  if (await prisma.user.count({ where: { role: "admin", active: true } })) return;
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || password.length < 10) {
    console.warn("seed: no admin yet. Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) and restart.");
    return;
  }
  await prisma.user.upsert({
    where: { email },
    update: { role: "admin", active: true, passwordHash: await bcrypt.hash(password, 12) },
    create: { email, name: "مدير الموقع", role: "admin", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`seed: admin ${email} ready`);
}

async function seedDemo() {
  if (process.env.SEED_DEMO !== "1") return;
  if (!(await prisma.news.count())) {
    await prisma.news.createMany({
      data: news
        .filter((n) => n.source !== "facebook")
        .map((n) => ({
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt,
          body: n.body.join("\n\n"),
          category: n.category,
          grades: n.grades ?? [],
          status: "published" as const,
          publishedAt: new Date(n.date),
        })),
    });
  }
  if (!(await prisma.announcement.count())) {
    await prisma.announcement.createMany({
      data: announcements.map((a) => ({ title: a.title, body: a.text, urgent: !!a.urgent, grades: a.grades ?? [], date: new Date(a.date) })),
    });
  }
  if (!(await prisma.event.count())) {
    await prisma.event.createMany({
      data: events.map((e) => ({ title: e.title, date: new Date(e.date), type: e.type, confirmed: e.confirmed, grades: e.grades ?? [] })),
    });
  }
  console.log("seed: demo content ready");
}

seedAdmin()
  .then(seedDemo)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
