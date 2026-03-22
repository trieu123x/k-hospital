import { prisma } from "../configs/prisma-config.js"

export const specialtyRepository = {
    findAll: async () => {
        return await prisma.specialty.findMany({
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
    }
}
