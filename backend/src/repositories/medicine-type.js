import { prisma } from "../configs/prisma-config.js"

export const medicineTypeRepository = {
    findAll: async () => {
        return await prisma.medicineType.findMany({
            where: { deletedAt: null },
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
    },

    create: async (data) => {
        return await prisma.medicineType.create({
            data,
            select: { id: true, name: true }
        })
    },

    update: async (id, data) => {
        return await prisma.medicineType.update({
            where: { id },
            data,
            select: { id: true, name: true }
        })
    },

    delete: async (id) => {
        return await prisma.medicineType.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true, name: true }
        })
    },

    restore: async (id) => {
        return await prisma.medicineType.update({
            where: { id },
            data: { deletedAt: null },
            select: { id: true, name: true }
        })
    },

    findAllForAdmin: async ({ name, page = 1, limit = 30, deleted = false }) => {
        const offset = (page - 1) * limit
        const where = {
            deletedAt: deleted ? { not: null } : null,
            ...(name ? { name: { contains: name, mode: 'insensitive' } } : {})
        }
        const [items, total] = await Promise.all([
            prisma.medicineType.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.medicineType.count({ where })
        ])
        return { items, total }
    }
}
