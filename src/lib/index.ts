import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function gracefulShutdown() {
  await prismaClient.$disconnect();
  console.log("\nPrisma disconnected gracefully.");
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default prismaClient;
