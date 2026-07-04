import { diseaseCategoryService } from "../services/disease-categorizes.js"
import { catchError } from "../helpers/catch-error.js"

export const getAllDiseaseCategories = catchError(async (req, res) => {
    const data = await diseaseCategoryService.getAllCategories()
    res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục bệnh thành công",
        data
    })
})

export const getDiseaseCategoryById = catchError(async (req, res) => {
    const { categorizeId } = req.params

    const data = await diseaseCategoryService.getCategoryById(categorizeId)
    res.status(200).json({
        success: true,
        message: "Lấy danh mục bệnh thành công",
        data
    })
})

export const getAllDiseaseCategoriesForAdmin = catchError(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 30
    const { name } = req.query
    const deleted = req.query.deleted === 'true'

    const result = await diseaseCategoryService.getAllCategoriesForAdmin({ name, page, limit, deleted })
    res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục bệnh cho admin thành công",
        data: result.items,
        pagination: result.pagination
    })
})

export const createDiseaseCategory = catchError(async (req, res) => {
    const data = req.body
    const category = await diseaseCategoryService.createCategory(data)
    res.status(201).json({
        success: true,
        message: "Tạo danh mục bệnh thành công",
        data: category
    })
})

export const updateDiseaseCategory = catchError(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const category = await diseaseCategoryService.updateCategory(id, data)
    res.status(200).json({
        success: true,
        message: "Cập nhật danh mục bệnh thành công",
        data: category
    })
})

export const deleteDiseaseCategory = catchError(async (req, res) => {
    const { id } = req.params
    await diseaseCategoryService.deleteCategory(id)
    res.status(200).json({
        success: true,
        message: "Xóa danh mục bệnh thành công"
    })
})

export const restoreDiseaseCategory = catchError(async (req, res) => {
    const { id } = req.params
    await diseaseCategoryService.restoreCategory(id)
    res.status(200).json({
        success: true,
        message: "Khôi phục danh mục bệnh thành công"
    })
})