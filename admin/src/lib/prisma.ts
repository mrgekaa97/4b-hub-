import { PrismaClient } from "@prisma/client";

// Standard Next.js pattern: in dev, hot-reload would otherwise create a new
// PrismaClient (and a new connection pool) on every file save. Stashing it
// on `globalThis` survives the reload; production always gets a fresh one.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
