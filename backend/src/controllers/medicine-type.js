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
