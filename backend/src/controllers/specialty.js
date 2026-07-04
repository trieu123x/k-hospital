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
    },

    getAllSpecialtiesForAdmin: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 30
            const { name } = req.query
            const deleted = req.query.deleted === 'true'
            
            const result = await specialtyService.getAllSpecialtiesForAdmin({ name, page, limit, deleted })
            
            res.status(200).json({
                success: true,
                message: "Lấy danh sách chuyên khoa cho admin thành công",
                data: result.items,
                pagination: result.pagination
            })
        } catch (error) {
            next(error)
        }
    },

    getSpecialtyById: async (req, res, next) => {
        try {
            const { id } = req.params
            const specialty = await specialtyService.getSpecialtyById(id)
            
            res.status(200).json({
                success: true,
                data: specialty
            })
        } catch (error) {
            next(error)
        }
    },

    createSpecialty: async (req, res, next) => {
        try {
            const data = req.body
            const specialty = await specialtyService.createSpecialty(data)
            
            res.status(201).json({
                success: true,
                message: "Tạo chuyên khoa thành công",
                data: specialty
            })
        } catch (error) {
            next(error)
        }
    },

    updateSpecialty: async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            const specialty = await specialtyService.updateSpecialty(id, data)
            
            res.status(200).json({
                success: true,
                message: "Cập nhật chuyên khoa thành công",
                data: specialty
            })
        } catch (error) {
            next(error)
        }
    },

    deleteSpecialty: async (req, res, next) => {
        try {
            const { id } = req.params
            await specialtyService.deleteSpecialty(id)
            
            res.status(200).json({
                success: true,
                message: "Xóa chuyên khoa thành công"
            })
        } catch (error) {
            next(error)
        }
    },

    restoreSpecialty: async (req, res, next) => {
        try {
            const { id } = req.params
            await specialtyService.restoreSpecialty(id)
            
            res.status(200).json({
                success: true,
                message: "Khôi phục chuyên khoa thành công"
            })
        } catch (error) {
            next(error)
        }
    }
}
