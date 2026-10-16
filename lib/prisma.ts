import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

type PrismaInstance = ReturnType<typeof createPrisma>;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaInstance };

// يُنشأ عند أول استخدام فقط، حتى يعمل الموقع بالمحتوى التجريبي بدون قاعدة بيانات.
export function db(): PrismaInstance {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrisma();
  return globalForPrisma.prisma;
}
