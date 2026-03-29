import { appointmentRepository } from "../repositories/appointment.js"
import { prisma } from "../configs/prisma-config.js" 

export const appointmentService = {
    getAllAppointments: async (filters) => {
        const appointments = await appointmentRepository.getAllAppointments(filters)

        return appointments.map(app => {
            return {
                appointmentId: app.id,
                date: app.schedule?.date,  
                shift: app.schedule?.shift, 
                status: app.status,
                reason: app.reason,
                patient: app.patient ? {
                    patientId: app.patient.id,
                    name: app.patient.fullName,
                    phone: app.patient.phone
                } : null,
                doctor: app.doctor ? {
                    doctorId: app.doctor.id,
                    name: app.doctor.fullName,
                    specialityName: app.doctor.doctor?.specialty?.name
                } : null
            }
        })
    },

    getAppointmentDetail: async (id) => {
        const appointment = await appointmentRepository.findById(id)
        if (!appointment) {
            throw Object.assign(new Error("Không tìm thấy lịch khám!"), { statusCode: 404 })
        }

        return {
            appointmentId: appointment.id,
            patient: appointment.patient ? {
                userId: appointment.patient.id,
                name: appointment.patient.fullName,
                phone: appointment.patient.phone,
                dob: appointment.patient.dob
            } : null,
            doctor: appointment.doctor ? {
                doctorId: appointment.doctor.id, 
                name: appointment.doctor.fullName,
                specialityName: appointment.doctor.doctor?.specialty?.name
            } : null,
            schedule: {
                date: appointment.schedule?.date,  
                shift: appointment.schedule?.shift, 
                status: appointment.status
            },
            note: appointment.reason,
            medicalRecord: appointment.medicalRecord || null
        }
    },

    getPatientHistory: async (filters) => {
        const appointments = await appointmentRepository.findByPatientId(filters)

        return appointments.map(app => {
            return {
                appointmentId: app.id,
                date: app.schedule?.date,   
                shift: app.schedule?.shift, 
                status: app.status,
                doctor: app.doctor ? {
                    doctorId: app.doctor.id,
                    name: app.doctor.fullName,
                    specialityName: app.doctor.doctor?.specialty?.name,
                    avatarUrl: app.doctor.avatarUrl
                } : null,
                symptoms: app.reason,
                diagnosis: app.medicalRecord?.diagnosis || null
            }
        })
    },

    getDoctorSchedule: async (filters) => {
        const appointments = await appointmentRepository.findByDoctorId(filters)

        return appointments.map(app => {
            return {
                appointmentId: app.id,
                date: app.schedule?.date,  
                shift: app.schedule?.shift, 
                status: app.status,
                reason: app.reason, 
                patient: app.patient ? {
                    patientId: app.patient.id,
                    name: app.patient.fullName,
                    phone: app.patient.phone,
                    dob: app.patient.dob,
                    avatarUrl: app.patient.avatarUrl
                } : null
            }
        })
    },

    getAvailableSlots: async (filters) => {
        const { date, doctorId } = filters
        
        if (!date || !doctorId) {
            throw Object.assign(new Error("Vui lòng cung cấp đầy đủ mã bác sĩ và ngày cần xem lịch!"), { statusCode: 400 })
        }

        const availableSchedules = await prisma.schedule.findMany({
            where: {
                doctorId: doctorId,
                date: new Date(date),
                isBooked: false
            },
            select: {
                id: true, 
                shift: true
            },
            orderBy: { shift: 'asc' }
        })

        return availableSchedules.map(schedule => ({
            scheduleId: schedule.id, 
            shift: schedule.shift,
            availableDoctors: [{ doctorId: doctorId }] 
        }))
    },

    bookAppointment: async (data) => {
        const { doctorId, date, shift, reason, patientId } = data 
        
        const appointmentDate = new Date(date) 
        const today = new Date()
        today.setHours(0, 0, 0, 0) 

        if (appointmentDate < today) {
            throw Object.assign(new Error("Không thể đặt lịch khám đã qua!"), { statusCode: 400 })
        }

        if (![1, 2, 3, 4].includes(shift)) {
            throw Object.assign(new Error("Ca khám không hợp lệ (chỉ từ 1 đến 4)!"), { statusCode: 400 })
        }

        const slot = await prisma.schedule.findFirst({
            where: {
                doctorId: doctorId,
                date: new Date(date),
                shift: shift
            }
        })

        if (!slot) {
            throw Object.assign(new Error("Bác sĩ không có lịch làm việc vào ca này!"), { statusCode: 404 })
        }


        const newAppointment = await appointmentRepository.create({
            patientId,
            doctorId,
            scheduleId: slot.id, 
            reason
        })

        return {
            appointmentId: newAppointment.id,
            status: newAppointment.status
        }
    },

    cancelAppointment: async (id) => {
        const appointment = await appointmentRepository.findById(id)
        
        if (!appointment) {
            throw Object.assign(new Error("Không tìm thấy lịch khám!"), { statusCode: 404 })
        }
        if (appointment.status === "completed") {
            throw Object.assign(new Error("Lịch khám đã hoàn thành, không thể hủy!"), { statusCode: 400 })
        }
        if (appointment.status === "cancelled") {
            throw Object.assign(new Error("Lịch khám này đã bị hủy từ trước!"), { statusCode: 400 })
        }
        
        const appointmentDate = new Date(appointment.schedule.date) 
        const now = new Date()

        const diffInHours = (appointmentDate - now) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            throw Object.assign(new Error("Chỉ có thể tự hủy lịch trước ngày khám ít nhất 24 tiếng. Vui lòng gọi điện cho phòng khám để được hỗ trợ!"), { statusCode: 400 })
        }

        await appointmentRepository.updateStatus(id, "cancelled")
        return true
    },

    updateAppointmentStatus: async (id, status) => {
        const existingAppointment = await appointmentRepository.findById(id)
        if (!existingAppointment) {
            throw Object.assign(new Error("Không tìm thấy lịch khám!"), { statusCode: 404 })
        }

        if (existingAppointment.status === "cancelled") {
            throw Object.assign(new Error("Lịch khám này đã bị hủy từ trước, không thể thay đổi trạng thái nữa!"), { statusCode: 400 })
        }

        if (existingAppointment.status === "completed") {
            throw Object.assign(new Error("Lịch khám này đã hoàn thành, không thể thay đổi trạng thái!"), { statusCode: 400 })
        }

        const updatedAppointment = await appointmentRepository.updateStatus(id, status)
        return updatedAppointment
    }
}