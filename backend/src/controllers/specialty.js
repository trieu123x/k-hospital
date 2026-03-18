import { specialtyService } from "../services/specialty.js"

export const specialtyController = {
    getAllSpecialties: async (req, res, next) => {
        try {
            const specialties = await specialtyService.getAllSpecialties()
            
            res.status(200).json({
                success: true,
                data: specialties
            })
        } catch (error) {
            next(error)
        }
    },

    getDoctorsBySpecialty: async (req, res, next) => {
        try {
            const { id } = req.params
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10
            
            const result = await specialtyService.getDoctorsBySpecialty(id, page, limit)
            
            res.status(200).json({
                success: true,
                data: result.doctors,
                pagination: result.pagination
            })
        } catch (error) {
            next(error)
        }
    }
}
