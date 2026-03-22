import { medicineService } from "../services/medicine.js"
import { catchError } from "../helpers/catchError.js"

export const getAllMedicines = catchError(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query
    const data = await medicineService.getAllMedicines(filters, parseInt(page), parseInt(limit))
    res.status(200).json({
        success: true,
        message: "Lấy danh sách thuốc thành công",
        data
    })
})

export const getMedicineById = catchError(async (req, res) => {
    const { id } = req.params
    const data = await medicineService.getMedicineById(id)
    res.status(200).json({
        success: true,
        message: "Lấy thông tin thuốc thành công",
        data
    })
})

export const createMedicine = catchError(async (req, res) => {
    const data = await medicineService.createMedicine(req.body)
    res.status(201).json({
        success: true,
        message: "Thêm thuốc thành công",
        data
    })
})

export const updateMedicine = catchError(async (req, res) => {
    const { id } = req.params
    const data = await medicineService.updateMedicine(id, req.body)
    res.status(200).json({
        success: true,
        message: "Cập nhật thuốc thành công",
        data
    })
})

export const deleteMedicine = catchError(async (req, res) => {
    const { id } = req.params
    await medicineService.deleteMedicine(id)
    res.status(200).json({
        success: true,
        message: "Xóa thuốc thành công"
    })
})  