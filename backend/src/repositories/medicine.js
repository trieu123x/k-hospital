import { prisma } from "../configs/prisma-config.js"

export const medicineRepository = {
    countAll: async () => {
        return await prisma.medicine.count()
    },

    findAllForAdmin: async ({ name, typeId, lastId, limit = 30 }) => {
        const where = {}
        if (name) where.name = { contains: name, mode: 'insensitive' }
        if (typeId) where.typeId = typeId

        if (lastId) {
            where.id = { gt: lastId }
        }

        return await prisma.medicine.findMany({
            where,
            take: limit,
            orderBy: { id: 'asc' },
            include: { medicineType: true }
        })
    },

    findAll: async (filters = {}, skip = 0, limit = 10) => {
        const where = {}

        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' }
        }
        if (filters.typeId) {
            where.typeId = filters.typeId
        }

        const [medicines, total] = await Promise.all([
            prisma.medicine.findMany({
                where,
                skip,
                take: limit,
                include: { medicineType: true }
            }),
            prisma.medicine.count({ where })
        ])

        return { medicines, total }
    },

    findById: async (id) => {
        return await prisma.medicine.findUnique({
            where: { id },
            include: { medicineType: true }
        })
    },

    create: async (data) => {
        return await prisma.medicine.create({
            data,
            include: { medicineType: true }
        })
    },

    update: async (id, data) => {
        return await prisma.medicine.update({
            where: { id },
            data,
            include: { medicineType: true }
        })
    },

    delete: async (id) => {
        return await prisma.medicine.delete({
            where: { id }
        })
    }
}
