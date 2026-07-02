import { prisma, Prisma } from "../configs/prisma-config.js"
import { removeVietnameseTones } from "../helpers/string-format.js"

export const userRepository = {
    countAll: async () => {
        return await prisma.profile.count()
    },

    findAllForAdmin: async ({ role, name, page = 1, limit = 30 }) => {
        const cleanName = name ? removeVietnameseTones(name) : null
        const searchPattern = cleanName ? `%${cleanName}%` : null
        const offset = (page - 1) * limit

        const filterConditions = Prisma.sql`
            1=1
            ${role ? Prisma.sql`AND role = ${role}::"UserRole"` : Prisma.empty}
            ${name ? Prisma.sql`AND (full_name_clean LIKE ${searchPattern} OR full_name_clean % ${cleanName})` : Prisma.empty}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM profiles
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const users = await prisma.$queryRaw`
            SELECT 
                id, 
                full_name AS "fullName", 
                phone, 
                email, 
                role, 
                is_active AS "isActive", 
                avatar_crop_data AS "avatarCropData"
            FROM profiles
            WHERE ${filterConditions}
            ORDER BY 
                ${name ? Prisma.sql`similarity(full_name_clean, ${cleanName}) DESC,` : Prisma.empty} 
                id ASC
            LIMIT ${limit} OFFSET ${offset}
        `

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
