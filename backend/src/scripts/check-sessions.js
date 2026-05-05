import { prisma } from '../configs/prisma-config.js'

async function main() {
  const sessions = await prisma.chatSession.groupBy({
    by: ['userId'],
    _count: {
      id: true
    }
  })
  console.log("Sessions per User ID:", JSON.stringify(sessions, null, 2))
  
  const nullSessions = await prisma.chatSession.findMany({
    where: { userId: null },
    take: 10
  })
  console.log("Samples of NULL sessions:", JSON.stringify(nullSessions, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
