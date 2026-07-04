import { degreeService } from "../services/degree.js"
import { catchError } from "../helpers/catch-error.js"

export const getAllDegrees = catchError(async (req, res) => {
    const data = await degreeService.getAllDegrees()
    res.status(200).json({
        success: true,
        message: "Lấy danh sách bằng cấp thành công",
        data
    })
})

export const getDegreeById = catchError(async (req, res) => {
    const { id } = req.params

    const data = await degreeService.getDegreeById(id)
    res.status(200).json({
        success: true,
        message: "Lấy bằng cấp thành công",
        data
    })
})

export const getAllDegreesForAdmin = catchError(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 30
    const { name } = req.query
    const deleted = req.query.deleted === 'true'

    const result = await degreeService.getAllDegreesForAdmin({ name, page, limit, deleted })
    res.status(200).json({
        success: true,
        message: "Lấy danh sách bằng cấp cho admin thành công",
        data: result.items,
        pagination: result.pagination
    })
})

export const createDegree = catchError(async (req, res) => {
    const data = req.body
    const degree = await degreeService.createDegree(data)
    res.status(201).json({
        success: true,
        message: "Tạo bằng cấp thành công",
        data: degree
    })
})

export const updateDegree = catchError(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const degree = await degreeService.updateDegree(id, data)
    res.status(200).json({
        success: true,
        message: "Cập nhật bằng cấp thành công",
        data: degree
    })
})

export const deleteDegree = catchError(async (req, res) => {
    const { id } = req.params
    await degreeService.deleteDegree(id)
    res.status(200).json({
        success: true,
        message: "Xóa bằng cấp thành công"
    })
})

export const restoreDegree = catchError(async (req, res) => {
    const { id } = req.params
    await degreeService.restoreDegree(id)
    res.status(200).json({
        success: true,
        message: "Khôi phục bằng cấp thành công"
    })
})
