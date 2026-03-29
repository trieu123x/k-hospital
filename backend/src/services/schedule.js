import { scheduleRepository } from "../repositories/schedule.js"
import { prisma } from "../configs/prisma-config.js"

export const scheduleService = {
    
    createSchedules: async (doctorId, schedulesInput) => {
        
        if (!schedulesInput || !Array.isArray(schedulesInput) || schedulesInput.length === 0) {
            throw Object.assign(new Error("Dữ liệu đăng ký lịch không hợp lệ!"), { statusCode: 400 })
        }

        const dataToInsert = []
        for (const item of schedulesInput) {
            for (const shift of item.shifts) {
                if ([1, 2, 3, 4].includes(shift)) {
                    dataToInsert.push({
                        doctorId: doctorId,
                        date: new Date(item.date),
                        shift: shift,
                        isBooked: false 
                    })
                }
            }
        }

        if (dataToInsert.length === 0) {
            throw Object.assign(new Error("Không có ca làm việc nào hợp lệ để thêm!"), { statusCode: 400 })
        }

        const result = await scheduleRepository.createSchedules(dataToInsert)
        
        return {
            message: "Đăng ký lịch làm việc thành công!",
            slotsCreated: result.count 
        }
    },

    getDoctorSchedules: async (doctorId, filters) => {
        const { fromDate, toDate } = filters

        if (!fromDate || !toDate) {
            throw Object.assign(new Error("Vui lòng cung cấp khoảng thời gian cần xem (fromDate, toDate)!"), { statusCode: 400 })
        }

        const schedules = await scheduleRepository.getDoctorSchedules(doctorId, fromDate, toDate)
        
        return schedules.map(slot => ({
            scheduleId: slot.id,
            date: slot.date,
            shift: slot.shift,
            isBooked: slot.isBooked,
            appointment: slot.appointment ? {
                appointmentId: slot.appointment.id,
                status: slot.appointment.status,
                patientName: slot.appointment.patient?.fullName,
                patientPhone: slot.appointment.patient?.phone
            } : null 
        }))
    },

    deleteSchedule: async (scheduleId, doctorId) => {
        const slot = await prisma.schedule.findUnique({
            where: { id: scheduleId }
        })

        if (!slot) {
            throw Object.assign(new Error("Không tìm thấy ca làm việc này!"), { statusCode: 404 })
        }

        if (slot.doctorId !== doctorId) {
            throw Object.assign(new Error("Bạn không có quyền xóa ca làm việc của người khác!"), { statusCode: 403 })
        }

        if (slot.isBooked) {
            throw Object.assign(new Error("Ca làm việc này đã có bệnh nhân đặt hẹn! Vui lòng hủy lịch hẹn trước khi xóa ca."), { statusCode: 400 })
        }

        await scheduleRepository.deleteSchedule(scheduleId)
        return true
    }
}