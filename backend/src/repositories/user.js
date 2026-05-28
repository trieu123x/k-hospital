import { prisma } from "../configs/prisma-config.js"
import { removeVietnameseTones } from "../helpers/string-format.js"

export const userRepository = {
    countAll: async () => {
        return await prisma.profile.count()
    },

    findAllForAdmin: async ({ role, name, page = 1, limit = 30 }) => {
        const where = {}
        if (role) where.role = role
        if (name) where.fullNameClean = { contains: removeVietnameseTones(name), mode: 'insensitive' }

        const skip = (page - 1) * limit
        const [users, total] = await Promise.all([
            prisma.profile.findMany({
                where,
                skip,
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
            }),
            prisma.profile.count({ where })
        ])

        return { users, total }
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

    update: async (id, data, doctorData = null) => {
        const updatePayload = {
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
        }

        if (doctorData) {
            updatePayload.data.doctor = {
                update: doctorData
            }
        }

        return await prisma.profile.update(updatePayload)
    },

    delete: async (id) => {
        return await prisma.profile.delete({
            where: { id }
        })
    }
}
