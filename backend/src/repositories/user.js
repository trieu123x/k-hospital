import { prisma } from "../configs/prisma-config.js"

export const userRepository = {
    countAll: async () => {
        return await prisma.profile.count()
    },

    findAllForAdmin: async ({ role, name, lastId, limit = 30 }) => {
        const where = {}
        if (role) where.role = role
        if (name) where.fullName = { contains: name, mode: 'insensitive' }
        if (lastId) where.id = { gt: lastId }

        return await prisma.profile.findMany({
            where,
            take: limit,
            orderBy: { id: 'asc' },
            select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                role: true,
                isActive: true,
                avatarCropData: true
            }
        })
    },

    findAll: async (filters = {}, skip = 0, take = 10) => {
        const [users, total] = await Promise.all([
            prisma.profile.findMany({
                where: filters,
                skip,
                take,
                include: {
                    doctor: {
                        include: {
                            specialty: true,
                            degree: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.profile.count({ where: filters })
        ])

        return { users, total }
    },

    findById: async (id) => {
        return await prisma.profile.findUnique({
            where: { id },
            include: {
                doctor: {
                    include: {
                        specialty: true,
                        degree: true
                    }
                }
            }
        })
    },

    update: async (id, data) => {
        return await prisma.profile.update({
            where: { id },
            data,
            include: {
                doctor: {
                    include: {
                        specialty: true,
                        degree: true
                    }
                }
            }
        })
    },

    delete: async (id) => {
        return await prisma.profile.delete({
            where: { id }
        })
    }
}
