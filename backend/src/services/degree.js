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
    }
}
