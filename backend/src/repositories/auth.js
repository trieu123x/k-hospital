import { prisma } from "../configs/prisma-config.js"

export const profileRepository = {
    findById: async (id) => {
        return await prisma.profile.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                phone: true,
                avatarUrl: true,
                role: true,
                dob: true,
                address: true,
                createdAt: true,
            }
        })
    },

    create: async ({ id, fullName, phone, role = "patient" }) => {
        return await prisma.profile.create({
            data: { id, fullName, phone, role }
        })
    },

    findByPhone: async (phone) => {
        return await prisma.profile.findUnique({
            where: { phone }
        })
    }
}
