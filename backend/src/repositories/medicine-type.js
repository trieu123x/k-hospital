import { prisma } from "../configs/prisma-config.js"

export const medicineTypeRepository = {
    findAll: async () => {
        return await prisma.medicineType.findMany({
            select: {
                id: true,
                name: true,
                description: true
            },
            orderBy: { name: 'asc' }
        })
    },

    findById: async (id) => {
        return await prisma.medicineType.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true
            }
        })
    }
}
