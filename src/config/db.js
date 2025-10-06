import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
    process.exit(1);
  }
}
