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
                    specialty: true,
                    degree: true
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
                specialty: true,
                degree: true
            }
        })
    },

    updateDoctorInfo: async (id, doctorData) => {
        return await prisma.doctor.upsert({
            where: { id },
            update: doctorData,
            create: {
                id,
                ...doctorData
            },
            include: {
                profile: true,
                specialty: true,
                degree: true
            }
        })
    },

    createDoctor: async (data) => {
        return await prisma.doctor.create({
            data,
            include: {
                profile: true,
                specialty: true,
                degree: true
            }
        })
    },

    createChunks: async (doctorId, chunks) => {
        await prisma.$executeRaw`DELETE FROM doctor_chunks WHERE doctor_id = ${doctorId}::uuid`
        for (const chunk of chunks) {
            const vectorString = `[${chunk.vector.join(',')}]`
            await prisma.$executeRaw`
                INSERT INTO doctor_chunks (id, doctor_id, content, embedding)
                VALUES (gen_random_uuid(), ${doctorId}::uuid, ${chunk.content}, ${vectorString}::vector)
            `
        }
    }
}
