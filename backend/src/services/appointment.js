import { appointmentRepository } from "../repositories/appointment.js"

export const appointmentService = {

    getAllAppointments: async (filters) => {
        const appointments = await appointmentRepository.getAllAppointments(filters)

        return appointments.map(app => {
            return {
                appointmentId: app.id,
                date: app.date,
                shift: app.shift, 
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
                date: appointment.date,
                shift: appointment.shift, 
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
                date: app.date,
                shift: app.shift, 
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
                date: app.date,
                shift: app.shift, 
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
        
        if (!date) {
            throw Object.assign(new Error("Vui lòng cung cấp ngày cần xem lịch!"), { statusCode: 400 })
        }

        const bookedAppointments = await appointmentRepository.findBookedAppointments({
            date, doctorId
        })

        const allShifts = [1, 2, 3, 4] 

        if (doctorId) {
            const bookedShifts = bookedAppointments.map(app => app.shift)
            
            return allShifts
                .filter(shift => !bookedShifts.includes(shift))
                .map(shift => ({
                    shift: shift, 
                    availableDoctors: [{ doctorId: doctorId }] 
                }))
        }
        
        return allShifts.map(shift => ({
            shift: shift,
            availableDoctors: [] 
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

        const existingSlot = await appointmentRepository.checkSlot(doctorId, date, shift)
        if (existingSlot) {
            throw Object.assign(new Error("Khung giờ này đã có người đặt, vui lòng chọn ca khác!"), { statusCode: 409 })
        }

        const newAppointment = await appointmentRepository.create({
            patientId,
            doctorId,
            date,
            shift,
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
        
        const appointmentDate = new Date(appointment.date) 
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