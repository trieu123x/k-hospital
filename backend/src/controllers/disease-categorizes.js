import { diseaseCategoryService } from "../services/disease-categorizes.js"
import { catchError } from "../helpers/catchError.js"

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