import { prisma, Prisma } from "../configs/prisma-config.js"
import { removeVietnameseTones } from "../helpers/string-format.js"

export const medicineRepository = {
    countAll: async () => {
        return await prisma.medicine.count({
            where: { deletedAt: null }
        })
    },

    findAllForAdmin: async ({ typeId, name, page = 1, limit = 30, deleted = false }) => {
        const cleanName = name ? removeVietnameseTones(name) : null
        const searchPattern = cleanName ? `%${cleanName}%` : null
        const offset = (page - 1) * limit

        const filterConditions = Prisma.sql`
            ${deleted ? Prisma.sql`m.deleted_at IS NOT NULL` : Prisma.sql`m.deleted_at IS NULL`}
            ${typeId ? Prisma.sql`AND m.type_id = ${typeId}::uuid` : Prisma.empty}
            ${name ? Prisma.sql`AND (m.name_clean LIKE ${searchPattern} OR m.name_clean % ${cleanName})` : Prisma.empty}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM medicines m
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const medicines = await prisma.$queryRaw`
            SELECT 
                m.id, 
                m.name, 
                m.image_url AS "imageUrl", 
                m.type_id AS "typeId", 
                m.ingredients, 
                m.dosage, 
                m.usage_instruction AS "usageInstruction", 
                m.side_effects AS "sideEffects",
                mt.id AS "medicineType.id",
                mt.name AS "medicineType.name",
                mt.description AS "medicineType.description"
            FROM medicines m
            LEFT JOIN medicine_types mt ON m.type_id = mt.id
            WHERE ${filterConditions}
            ORDER BY 
                ${name ? Prisma.sql`similarity(m.name_clean, ${cleanName}) DESC,` : Prisma.empty} 
                m.id ASC
            LIMIT ${limit} OFFSET ${offset}
        `

        const mappedMedicines = medicines.map(m => ({
            id: m.id,
            name: m.name,
            imageUrl: m.imageUrl,
            typeId: m.typeId,
            ingredients: m.ingredients,
            dosage: m.dosage,
            usageInstruction: m.usageInstruction,
            sideEffects: m.sideEffects,
            medicineType: m["medicineType.id"] ? {
                id: m["medicineType.id"],
                name: m["medicineType.name"],
                description: m["medicineType.description"]
            } : null
        }))

        return { medicines: mappedMedicines, total }
    },

    findAll: async (filters = {}, skip = 0, limit = 10) => {
        const { name, typeId } = filters
        const cleanName = name ? removeVietnameseTones(name) : null
        const searchPattern = cleanName ? `%${cleanName}%` : null

        const filterConditions = Prisma.sql`
            m.deleted_at IS NULL
            ${typeId ? Prisma.sql`AND m.type_id = ${typeId}::uuid` : Prisma.empty}
            ${name ? Prisma.sql`AND (m.name_clean LIKE ${searchPattern} OR m.name_clean % ${cleanName})` : Prisma.empty}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM medicines m
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const medicines = await prisma.$queryRaw`
            SELECT 
                m.id, 
                m.name, 
                m.image_url AS "imageUrl", 
                m.type_id AS "typeId", 
                m.ingredients, 
                m.dosage, 
                m.usage_instruction AS "usageInstruction", 
                m.side_effects AS "sideEffects",
                mt.id AS "medicineType.id",
                mt.name AS "medicineType.name",
                mt.description AS "medicineType.description"
            FROM medicines m
            LEFT JOIN medicine_types mt ON m.type_id = mt.id
            WHERE ${filterConditions}
            ORDER BY 
                ${name ? Prisma.sql`similarity(m.name_clean, ${cleanName}) DESC,` : Prisma.empty} 
                m.id ASC
            LIMIT ${limit} OFFSET ${skip}
        `

        const mappedMedicines = medicines.map(m => ({
            id: m.id,
            name: m.name,
            imageUrl: m.imageUrl,
            typeId: m.typeId,
            ingredients: m.ingredients,
            dosage: m.dosage,
            usageInstruction: m.usageInstruction,
            sideEffects: m.sideEffects,
            medicineType: m["medicineType.id"] ? {
                id: m["medicineType.id"],
                name: m["medicineType.name"],
                description: m["medicineType.description"]
            } : null
        }))

        return { medicines: mappedMedicines, total }
    },

    findById: async (id) => {
        return await prisma.medicine.findUnique({
            where: { id },
            include: {
                medicineType: true,
                diseases: {
                    include: {
                        disease: {
                            include: {
                                specialty: true,
                                category: true
                            }
                        }
                    }
                }
            }
        })
    },

    create: async (data) => {
        return await prisma.medicine.create({
            data,
            include: { medicineType: true }
        })
    },

    update: async (id, data) => {
        return await prisma.medicine.update({
            where: { id },
            data,
            include: { medicineType: true }
        })
    },

    delete: async (id) => {
        return await prisma.medicine.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    },

    restore: async (id) => {
        return await prisma.medicine.update({
            where: { id },
            data: { deletedAt: null }
        })
    },

    createChunks: async (medicineId, chunks) => {
        await prisma.$executeRaw`DELETE FROM medicine_chunks WHERE medicine_id = ${medicineId}::uuid`
        for (const chunk of chunks) {
            const vectorString = `[${chunk.vector.join(',')}]`
            await prisma.$executeRaw`
                INSERT INTO medicine_chunks (id, medicine_id, content, embedding)
                VALUES (gen_random_uuid(), ${medicineId}::uuid, ${chunk.content}, ${vectorString}::vector)
            `
        }
    }
}
