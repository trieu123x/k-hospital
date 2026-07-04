import { prisma } from "../configs/prisma-config.js"

export const specialtyRepository = {
    findAll: async () => {
        return await prisma.specialty.findMany({
            where: { deletedAt: null },
            orderBy: { name: 'asc' }
        })
    },

    findDoctorsBySpecialtyId: async (specialtyId, skip = 0, take = 10) => {
        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                where: { specialtyId },
                skip,
                take,
                include: {
                    profile: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.doctor.count({ where: { specialtyId } })
        ])
        return { doctors, total }
    },

    findById: async (id) => {
        return await prisma.specialty.findUnique({
            where: { id }
        })
    },

    create: async (data) => {
        return await prisma.specialty.create({
            data,
            select: { id: true, name: true }
        })
    },

    update: async (id, data) => {
        return await prisma.specialty.update({
            where: { id },
            data,
            select: { id: true, name: true }
        })
    },

    delete: async (id) => {
        return await prisma.specialty.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true, name: true }
        })
    },

    restore: async (id) => {
        return await prisma.specialty.update({
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
            prisma.specialty.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.specialty.count({ where })
        ])
        return { items, total }
    }
}
