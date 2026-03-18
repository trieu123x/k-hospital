import { prisma } from "../configs/prisma-config.js"

export const doctorRepository = {
    findAllDoctors: async (filters = {}, skip = 0, take = 10) => {
        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                where: filters,
                skip,
                take,
                include: {
                    profile: true,
                    specialty: true
                }
            }),
            prisma.doctor.count({ where: filters })
        ])
        return { doctors, total }
    },

    findDoctorById: async (id) => {
        return await prisma.doctor.findUnique({
            where: { id },
            include: {
                profile: true,
                specialty: true
            }
        })
    },

    updateDoctorInfo: async (id, doctorData) => {
        return await prisma.doctor.update({
            where: { id },
            data: doctorData,
            include: {
                profile: true,
                specialty: true
            }
        })
    }
}
