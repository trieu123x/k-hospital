import { appointmentRepository } from "../repositories/appointment.js"

export const appointmentService = {
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
                specialityName: appointment.doctor.specialty?.name
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
                    specialityName: app.doctor.specialty?.name,
                    avatarUrl: app.doctor.avatarUrl
                } : null,
                symptoms: app.reason,
                diagnosis: app.medicalRecord?.diagnosis || null
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

        await appointmentRepository.updateStatus(id, "cancelled")
        return true
    },

    updateAppointmentStatus: async (id, status) => {
        const appointment = await appointmentRepository.updateStatus(id, status)
        return appointment
    }
}