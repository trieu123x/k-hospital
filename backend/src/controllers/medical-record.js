import { medicalRecordService } from "../services/medical-record.js"
import { catchError } from "../helpers/catch-error.js"

export const createMedicalRecord = catchError(async (req, res) => {
    const { appointmentId } = req.params
    const recordData = req.body

    const data = await medicalRecordService.createRecord(appointmentId, recordData)
    
    res.status(201).json({
        success: true,
        message: "Tạo hồ sơ bệnh án và hoàn thành ca khám thành công.",
        data
    })
})

export const getMedicalRecordDetail = catchError(async (req, res) => {
    const { appointmentId } = req.params

    const data = await medicalRecordService.getRecordDetail(appointmentId)
    
    res.status(200).json({
        success: true,
        message: "Lấy chi tiết hồ sơ bệnh án thành công.",
        data
    })
})

export const updateMedicalRecord = catchError(async (req, res) => {
    const { appointmentId } = req.params
    const updateData = req.body

    const data = await medicalRecordService.updateRecord(appointmentId, updateData)
    
    res.status(200).json({
        success: true,
        message: "Cập nhật hồ sơ bệnh án thành công.",
        data
    })
})