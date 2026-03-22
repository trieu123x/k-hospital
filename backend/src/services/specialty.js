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
    }
}
