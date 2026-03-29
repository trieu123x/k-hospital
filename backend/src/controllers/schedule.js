import { scheduleService } from "../services/schedule.js"
import { catchError } from "../helpers/catch-error.js"

export const createSchedules = catchError(async (req, res) => {
    const doctorId = req.user?.id || req.body.doctorId; 
    const { schedules } = req.body; 

    const data = await scheduleService.createSchedules(doctorId, schedules)

    res.status(201).json({
        success: true,
        message: data.message,
        data: {
            slotsCreated: data.slotsCreated
        }
    })
})

export const getDoctorSchedules = catchError(async (req, res) => {
    const { doctorId } = req.params;
    const { fromDate, toDate } = req.query;

    const data = await scheduleService.getDoctorSchedules(doctorId, { fromDate, toDate })

    res.status(200).json({
        success: true,
        message: "Lấy thời khóa biểu bác sĩ thành công",
        data
    })
})

export const deleteSchedule = catchError(async (req, res) => {
    const { scheduleId } = req.params;
    const doctorId = req.user?.id || req.body.doctorId; 

    await scheduleService.deleteSchedule(scheduleId, doctorId)

    res.status(200).json({
        success: true,
        message: "Xóa ca làm việc thành công"
    })
})