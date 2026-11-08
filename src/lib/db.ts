import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Lazy client — avoids crash at build time when DATABASE_URL is missing */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrisma();
      }
      const value = (globalForPrisma.prisma as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === "function" ? value.bind(globalForPrisma.prisma) : value;
    },
  });
