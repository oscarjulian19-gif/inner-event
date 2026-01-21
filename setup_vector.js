const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔌 Connecting to database...");
    await prisma.$connect();
    console.log("✅ Connected.");

    console.log("🛠 Enabling 'vector' extension...");
    await prisma.$executeRawUnsafe("CREATE EXTENSION IF NOT EXISTS vector;");
    console.log("✅ Extension 'vector' enabled.");

  } catch (e) {
    console.error("❌ Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
