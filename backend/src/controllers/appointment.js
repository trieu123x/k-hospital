import { appointmentService } from "../services/appointment.js"
import { catchError } from "../helpers/catch-error.js"

export const bookAppointment = catchError(async (req, res) => {
    const appointmentData = req.body 

    const data = await appointmentService.bookAppointment(appointmentData)
    
    res.status(201).json({
        success: true,
        message: "Đặt lịch khám thành công. Vui lòng chờ bác sĩ xác nhận.",
        data
    })
})

export const getAvailableSlots = catchError(async (req, res) => {
    const { date, doctorId, specialtyId } = req.query
    
    const data = await appointmentService.getAvailableSlots({ 
        date, 
        doctorId, 
        specialtyId 
    })

    res.status(200).json({
        success: true,
        message: "Lấy danh sách giờ trống thành công",
        data
    })
})

export const getAppointmentDetail = catchError(async (req, res) => {
    const { appointmentId } = req.params

    const data = await appointmentService.getAppointmentDetail(appointmentId)
    
    res.status(200).json({
        success: true,
        message: "Lấy thông tin lịch khám thành công",
        data
    })
})

export const getPatientHistory = catchError(async (req, res) => {
    const { userId } = req.params 
    const { lastId, limit, desc } = req.query
    
    const data = await appointmentService.getPatientHistory({ 
        patientId: userId,
        lastId,
        limit: limit ? parseInt(limit) : 20,
        desc: desc === 'false' ? false : true 
    })

    res.status(200).json({
        success: true,
        message: "Lấy danh sách lịch khám thành công",
        data
    })
})

export const cancelAppointment = catchError(async (req, res) => {
    const { appointmentId } = req.params

    await appointmentService.cancelAppointment(appointmentId)
    
    res.status(200).json({
        success: true,
        message: "Hủy lịch khám thành công."
    })
})

export const updateAppointmentStatus = catchError(async (req, res) => {
    const { appointmentId } = req.params
    const { status } = req.body

    const data = await appointmentService.updateAppointmentStatus(appointmentId, status)
    
    res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái lịch khám thành công.",
        data
    })
})
