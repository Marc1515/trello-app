import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const createClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is required to initialize Prisma Client");
    }
    const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5000 });
    return new PrismaClient({ adapter });
};

let productionClient: PrismaClient | undefined;

export const getDb = () => {
    if (process.env.NODE_ENV === "production") {
        return productionClient ??= createClient();
    }
    return globalThis.prisma ??= createClient();
};

