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
