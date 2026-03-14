import { prisma } from "../configs/prisma-config.js"

export const diseaseCategoryRepository = {
    findAll: async () => {
        console.log("RUN!")
        return await prisma.diseaseCategory.findMany({
            select: {
                id: true,
                name: true,
                description: true
            },
        })
    },

    findById: async (id) => {
        return await prisma.diseaseCategory.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true
        },
        })
    },
}