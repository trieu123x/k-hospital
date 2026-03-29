import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkPrisma() {
  try {
    console.log('Testing Prisma connection...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Visible tables:', tables);
    
    const count = await prisma.profile.count();
    console.log('Profile count:', count);
  } catch (err) {
    console.error('Prisma Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrisma();
