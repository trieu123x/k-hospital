import { prisma } from "../configs/prisma-config.js"

export const medicineRepository = {
    findAll: async (filters = {}, skip = 0, limit = 10) => {
        const where = {}

        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' }
        }
        if (filters.medicineType) {
            where.typeId = { equals: filters.medicineType }
        }

        const [medicines, total] = await Promise.all([
            prisma.medicine.findMany({
                where,
                skip,
                take: limit,
                include: {
                    medicineType: true
                }
            }),
            prisma.medicine.count({ where })
        ])

        return { medicines, total }
    },

    findById: async (id) => {
        return await prisma.medicine.findUnique({
            where: { id },
            include: {
                medicineType: true,
                diseases: {
                    include: {
                        disease: {
                            include: {
                                specialty: true,
                                category: true
                            }
                        }
                    }
                }
            }
        })
    },

    create: async (data) => {
        return await prisma.medicine.create({
            data
        })
    },

    update: async (id, data) => {
        return await prisma.medicine.update({
            where: { id },
            data
        })
    },

    delete: async (id) => {
        return await prisma.medicine.delete({
            where: { id }
        })
    }
}   

