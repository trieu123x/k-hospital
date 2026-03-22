import { prisma } from "../configs/prisma-config.js"

export const userRepository = {
    findAll: async (filters = {}, skip = 0, take = 10) => {
        const [users, total] = await Promise.all([
            prisma.profile.findMany({
                where: filters,
                skip,
                take,
                include: {
                    doctor: {
                        include: {
                            specialty: true
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
                        specialty: true
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
                        specialty: true
                    }
                }
            }
        })
    }
}
