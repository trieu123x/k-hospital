import { medicineService } from "../services/medicine.js"
import { catchError } from "../helpers/catch-error.js"

export const getTotalMedicines = catchError(async (req, res) => {
    const total = await medicineService.getTotalCount()
    res.status(200).json({
        success: true,
        data: { total }
    })
})

export const getMedicinesForAdmin = catchError(async (req, res) => {
    const { name, typeId, page, limit } = req.query
    const deleted = req.query.deleted === 'true'
    const data = await medicineService.getMedicinesForAdmin({
        name,
        typeId,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 30,
        deleted
    })
    res.status(200).json({
        success: true,
        message: "Lấy danh sách thuốc cho admin thành công",
        data: data.medicines,
        pagination: data.pagination
    })
})

export const getAllMedicines = catchError(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query
    const data = await medicineService.getAllMedicines(filters, parseInt(page), parseInt(limit))
    res.status(200).json({
        success: true,
        message: "Lấy danh sách thuốc thành công",
        data: data.medicines,
        pagination: data.pagination
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
    const file = req.file
    const data = await medicineService.createMedicine(req.body, file)
    res.status(201).json({
        success: true,
        message: "Thêm thuốc thành công",
        data
    })
})

export const updateMedicine = catchError(async (req, res) => {
    const { id } = req.params
    const file = req.file
    const data = await medicineService.updateMedicine(id, req.body, file)
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

export const restoreMedicine = catchError(async (req, res) => {
    const { id } = req.params
    await medicineService.restoreMedicine(id)
    res.status(200).json({
        success: true,
        message: "Khôi phục thuốc thành công"
    })
})  