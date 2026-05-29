
import "dotenv/config";
import { prisma } from "../configs/prisma-config.js";

async function run() {
  try {
    console.log("Truncating...");
    await prisma.$executeRawUnsafe("TRUNCATE TABLE disease_chunks, medicine_chunks, doctor_chunks CASCADE;");
    console.log("Altering...");
    await prisma.$executeRawUnsafe("ALTER TABLE disease_chunks ALTER COLUMN embedding TYPE vector(3072)");
    await prisma.$executeRawUnsafe("ALTER TABLE medicine_chunks ALTER COLUMN embedding TYPE vector(3072)");
    await prisma.$executeRawUnsafe("ALTER TABLE doctor_chunks ALTER COLUMN embedding TYPE vector(3072)");
    console.log("Success");
  } catch (e) {
    console.error("Loi:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
