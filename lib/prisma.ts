import { PrismaClient } from "@prisma/client";

// 1. Расширяем интерфейс globalThis для TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 2. Используем существующий экземпляр или создаём новый
const prisma = globalThis.prisma || new PrismaClient();

// 3. В development сохраняем PrismaClient в глобальную область
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
