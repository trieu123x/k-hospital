import { prisma } from "../configs/prisma-config.js"

export const degreeRepository = {
    findAll: async () => {
        return await prisma.degree.findMany({
            where: { deletedAt: null },
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
    },

    create: async (data) => {
        return await prisma.degree.create({
            data,
            select: { id: true, name: true }
        })
    },

    update: async (id, data) => {
        return await prisma.degree.update({
            where: { id },
            data,
            select: { id: true, name: true }
        })
    },

    delete: async (id) => {
        return await prisma.degree.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true, name: true }
        })
    },

    restore: async (id) => {
        return await prisma.degree.update({
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
            prisma.degree.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { rankWeight: 'desc' }
            }),
            prisma.degree.count({ where })
        ])
        return { items, total }
    }
}
