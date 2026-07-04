import { prisma, Prisma } from "../configs/prisma-config.js"

export const doctorRepository = {
    findAllDoctors: async (filters = {}, skip = 0, take = 10) => {
        let cleanName = null
        if (filters.profile?.fullNameClean?.contains) {
            cleanName = filters.profile.fullNameClean.contains
        } else if (filters.nameClean?.contains) {
            cleanName = filters.nameClean.contains
        }

        const specialtyId = filters.specialtyId || null
        const searchPattern = cleanName ? `%${cleanName}%` : null

        const filterConditions = Prisma.sql`
            p.is_active = true
            ${specialtyId ? Prisma.sql`AND d.specialty_id = ${specialtyId}::uuid` : Prisma.empty}
            ${cleanName ? Prisma.sql`AND (p.full_name_clean LIKE ${searchPattern} OR p.full_name_clean % ${cleanName})` : Prisma.empty}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM doctors d
            LEFT JOIN profiles p ON d.id = p.id
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const doctors = await prisma.$queryRaw`
            SELECT 
                d.id, 
                d.specialty_id AS "specialtyId", 
                d.degree_id AS "degreeId", 
                d.experience, 
                d.education, 
                d.achievements,
                p.id AS "profile.id",
                p.full_name AS "profile.fullName",
                p.full_name_clean AS "profile.fullNameClean",
                p.email AS "profile.email",
                p.phone AS "profile.phone",
                p.avatar_url AS "profile.avatarUrl",
                p.avatar_crop_data AS "profile.avatarCropData",
                p.role AS "profile.role",
                p.dob AS "profile.dob",
                p.address AS "profile.address",
                p.is_active AS "profile.isActive",
                s.id AS "specialty.id",
                s.name AS "specialty.name",
                s.description AS "specialty.description",
                deg.id AS "degree.id",
                deg.name AS "degree.name",
                deg.description AS "degree.description",
                deg.rank_weight AS "degree.rankWeight"
            FROM doctors d
            LEFT JOIN profiles p ON d.id = p.id
            LEFT JOIN specialties s ON d.specialty_id = s.id AND s.deleted_at IS NULL
            LEFT JOIN degrees deg ON d.degree_id = deg.id AND deg.deleted_at IS NULL
            WHERE ${filterConditions}
            ORDER BY 
                ${cleanName ? Prisma.sql`similarity(p.full_name_clean, ${cleanName}) DESC,` : Prisma.empty} 
                d.id ASC
            LIMIT ${take} OFFSET ${skip}
        `

        const mappedDoctors = doctors.map(d => ({
            id: d.id,
            specialtyId: d.specialtyId,
            degreeId: d.degreeId,
            experience: d.experience,
            education: d.education,
            achievements: d.achievements,
            profile: d["profile.id"] ? {
                id: d["profile.id"],
                fullName: d["profile.fullName"],
                fullNameClean: d["profile.fullNameClean"],
                email: d["profile.email"],
                phone: d["profile.phone"],
                avatarUrl: d["profile.avatarUrl"],
                avatarCropData: d["profile.avatarCropData"],
                role: d["profile.role"],
                dob: d["profile.dob"],
                address: d["profile.address"],
                isActive: d["profile.isActive"]
            } : null,
            specialty: d["specialty.id"] ? {
                id: d["specialty.id"],
                name: d["specialty.name"],
                description: d["specialty.description"]
            } : null,
            degree: d["degree.id"] ? {
                id: d["degree.id"],
                name: d["degree.name"],
                description: d["degree.description"],
                rankWeight: d["degree.rankWeight"]
            } : null
        }))

        return { doctors: mappedDoctors, total }
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
