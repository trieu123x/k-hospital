import { medicineTypeService } from "../services/medicine-type.js"
import { catchError } from "../helpers/catch-error.js"

export const getAllMedicineTypes = catchError(async (req, res) => {
    const data = await medicineTypeService.getAllMedicineTypes()
    res.status(200).json({
        success: true,
        message: "Lấy danh sách loại thuốc thành công",
        data
    })
})

export const getMedicineTypeById = catchError(async (req, res) => {
    const { id } = req.params

    const data = await medicineTypeService.getMedicineTypeById(id)
    res.status(200).json({
        success: true,
        message: "Lấy loại thuốc thành công",
        data
    })
})

export const getAllMedicineTypesForAdmin = catchError(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 30
    const { name } = req.query
    const deleted = req.query.deleted === 'true'

    const result = await medicineTypeService.getAllMedicineTypesForAdmin({ name, page, limit, deleted })
    res.status(200).json({
        success: true,
        message: "Lấy danh sách loại thuốc cho admin thành công",
        data: result.items,
        pagination: result.pagination
    })
})

export const createMedicineType = catchError(async (req, res) => {
    const data = req.body
    const type = await medicineTypeService.createMedicineType(data)
    res.status(201).json({
        success: true,
        message: "Tạo loại thuốc thành công",
        data: type
    })
})

export const updateMedicineType = catchError(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const type = await medicineTypeService.updateMedicineType(id, data)
    res.status(200).json({
        success: true,
        message: "Cập nhật loại thuốc thành công",
        data: type
    })
})

export const deleteMedicineType = catchError(async (req, res) => {
    const { id } = req.params
    await medicineTypeService.deleteMedicineType(id)
    res.status(200).json({
        success: true,
        message: "Xóa loại thuốc thành công"
    })
})

export const restoreMedicineType = catchError(async (req, res) => {
    const { id } = req.params
    await medicineTypeService.restoreMedicineType(id)
    res.status(200).json({
        success: true,
        message: "Khôi phục loại thuốc thành công"
    })
})
