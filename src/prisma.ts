import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

neonConfig.poolQueryViaFetch = true;

const neon = new Pool({
    connectionString: process.env.DATABASE_URL,
});
// console.log("DATABASE_URL", process.env.DATABASE_URL);
const adapter = new PrismaNeon(neon);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Extension을 적용한 PrismaClient 인스턴스 생성
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
