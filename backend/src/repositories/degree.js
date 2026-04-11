import { prisma } from "../configs/prisma-config.js"

export const degreeRepository = {
    findAll: async () => {
        return await prisma.degree.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                rankWeight: true
            },
            orderBy: { rankWeight: 'desc' }
        })
    },

    findById: async (id) => {
        return await prisma.degree.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                rankWeight: true
            }
        })
    }
}
