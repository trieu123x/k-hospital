import { degreeRepository } from "../repositories/degree.js"

export const degreeService = {
    getAllDegrees: async () => {
        const degrees = await degreeRepository.findAll()

        if (!degrees) {
            throw Object.assign(new Error("Lấy danh sách bằng cấp thất bại"), { statusCode: 500 })
        }

        return degrees.map(d => ({
            id: d.id,
            name: d.name,
            description: d.description,
            rankWeight: d.rankWeight
        }))
    },

    getDegreeById: async (id) => {
        const degree = await degreeRepository.findById(id)

        if (!degree) {
            throw Object.assign(new Error(`Bằng cấp ID ${id} không tồn tại`), { statusCode: 404 })
        }

        return {
            id: degree.id,
            name: degree.name,
            description: degree.description,
            rankWeight: degree.rankWeight
        }
    },

    createDegree: async (data) => {
        if (!data.name) {
            throw Object.assign(new Error("Tên bằng cấp không được để trống!"), { statusCode: 400 })
        }
        if (data.rankWeight !== undefined && data.rankWeight !== null) {
            data.rankWeight = parseInt(data.rankWeight)
        }
        return await degreeRepository.create(data)
    },

    updateDegree: async (id, data) => {
        const existing = await degreeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Bằng cấp không tồn tại!"), { statusCode: 404 })
        }
        if (data.rankWeight !== undefined && data.rankWeight !== null) {
            data.rankWeight = parseInt(data.rankWeight)
        }
        return await degreeRepository.update(id, data)
    },

    deleteDegree: async (id) => {
        const existing = await degreeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Bằng cấp không tồn tại!"), { statusCode: 404 })
        }
        return await degreeRepository.delete(id)
    },

    restoreDegree: async (id) => {
        const existing = await degreeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Bằng cấp không tồn tại!"), { statusCode: 404 })
        }
        return await degreeRepository.restore(id)
    },

    getAllDegreesForAdmin: async ({ name, page = 1, limit = 30, deleted = false }) => {
        const { items, total } = await degreeRepository.findAllForAdmin({ name, page, limit, deleted })
        return {
            items,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
}
