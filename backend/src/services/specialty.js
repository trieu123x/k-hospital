import { specialtyRepository } from "../repositories/specialty.js"

export const specialtyService = {
    getAllSpecialties: async () => {
        return await specialtyRepository.findAll()
    },

    getDoctorsBySpecialty: async (specialtyId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit
        const { doctors, total } = await specialtyRepository.findDoctorsBySpecialtyId(specialtyId, skip, limit)
        
        return {
            doctors,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: total === 0 ? 0 : Math.ceil(total / limit)
            }
        }
    },

    getSpecialtyById: async (id) => {
        const specialty = await specialtyRepository.findById(id)
        if (!specialty) {
            throw Object.assign(new Error("Không tìm thấy chuyên khoa!"), { statusCode: 404 })
        }
        return specialty
    },

    createSpecialty: async (data) => {
        if (!data.name) {
            throw Object.assign(new Error("Tên chuyên khoa không được để trống!"), { statusCode: 400 })
        }
        return await specialtyRepository.create(data)
    },

    updateSpecialty: async (id, data) => {
        const existing = await specialtyRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Chuyên khoa không tồn tại!"), { statusCode: 404 })
        }
        return await specialtyRepository.update(id, data)
    },

    deleteSpecialty: async (id) => {
        const existing = await specialtyRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Chuyên khoa không tồn tại!"), { statusCode: 404 })
        }
        return await specialtyRepository.delete(id)
    },

    restoreSpecialty: async (id) => {
        const existing = await specialtyRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Chuyên khoa không tồn tại!"), { statusCode: 404 })
        }
        return await specialtyRepository.restore(id)
    },

    getAllSpecialtiesForAdmin: async ({ name, page = 1, limit = 30, deleted = false }) => {
        const { items, total } = await specialtyRepository.findAllForAdmin({ name, page, limit, deleted })
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
