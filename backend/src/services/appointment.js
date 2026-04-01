import { appointmentRepository } from "../repositories/appointment.js"

export const appointmentService = {
    getAllAppointments: async (filters) => {
        const appointments = await appointmentRepository.getAllAppointments(filters)

        return appointments.map(app => ({
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
        }))
    },

    getAppointmentDetail: async (id) => {
        const appointment = await appointmentRepository.findById(id)
        if (!appointment) {
            throw Object.assign(new Error("Không tìm thấy lịch khám hoặc lịch đã bị hủy!"), { statusCode: 404 })
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

        return appointments.map(app => ({
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
        }))
    },

    getDoctorSchedule: async (filters) => {
        const appointments = await appointmentRepository.findByDoctorId(filters)

        return appointments.map(app => ({
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
        }))
    },

    getAvailableSlots: async (filters) => {
        const { date, doctorId } = filters

        if (!date) {
            throw Object.assign(new Error("Vui lòng cung cấp ngày cần xem lịch!"), { statusCode: 400 })
        }

        const targetDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (targetDate < today) {
            return []
        }

        let targetDoctors = []
        if (doctorId) {
            targetDoctors = [{ id: doctorId }]
        } else {
            targetDoctors = await prisma.profile.findMany({
                where: { role: 'doctor', isActive: true },
                select: { id: true }
            })
        }

        if (targetDoctors.length === 0) return []

        const unavailable = await appointmentRepository.getUnavailableSlots({ date, doctorId })

        const doctorBusyMap = {}
        targetDoctors.forEach(doc => {
            doctorBusyMap[doc.id] = new Set()
        })

        unavailable.doctorLeaves.forEach(leave => {
            if (doctorBusyMap[leave.doctorId]) {
                if (leave.shift === null) {
                    [1, 2, 3, 4].forEach(shift => doctorBusyMap[leave.doctorId].add(shift))
                } else {
                    doctorBusyMap[leave.doctorId].add(leave.shift)
                }
            }
        })

        unavailable.bookedShifts.forEach(app => {
            if (doctorBusyMap[app.doctorId]) {
                doctorBusyMap[app.doctorId].add(app.shift)
            }
        })

        const allShifts = [1, 2, 3, 4]
        const result = []

        allShifts.forEach(shift => {
            const availableDoctorsForShift = []
            
            targetDoctors.forEach(doc => {
                if (!doctorBusyMap[doc.id].has(shift)) {
                    availableDoctorsForShift.push({ doctorId: doc.id }) 
                }
            })

            if (availableDoctorsForShift.length > 0) {
                result.push({
                    shift: shift,
                    date: date,
                    availableDoctors: availableDoctorsForShift
                })
            }
        })

        return result
    },

    registerDoctorLeave: async (data) => {
        const { doctorId, date, shift, reason } = data;
        
        const leaveDate = new Date(date);
        const now = new Date();
        
        const startOfLeaveDate = new Date(date);
        startOfLeaveDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startOfLeaveDate < today) {
            throw Object.assign(new Error("Không thể đăng ký nghỉ cho ngày đã qua!"), { statusCode: 400 });
        }

        const shiftStartHours = { 1: 8, 2: 10, 3: 13, 4: 15, null: 8 }; 
        const targetTime = new Date(startOfLeaveDate);
        targetTime.setHours(shiftStartHours[shift] || 8, 0, 0, 0);

        const diffInHours = (targetTime - now) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            throw Object.assign(
                new Error("Bạn phải đăng ký nghỉ trước ít nhất 24 tiếng so với giờ bắt đầu ca khám!"), 
                { statusCode: 400 }
            );
        }

        const appointmentsOnDate = await appointmentRepository.findByDoctorId({
            doctorId,
            date: startOfLeaveDate,
            limit: 50 
        });

        const conflictingAppointments = appointmentsOnDate.filter(app => {
            const isTargetShift = shift ? app.shift === shift : true;
            const isConflictingStatus = ['pending', 'confirmed'].includes(app.status);
            return isTargetShift && isConflictingStatus;
        });

        if (conflictingAppointments.length > 0) {
            throw Object.assign(
                new Error(`Đã có ${conflictingAppointments.length} lịch hẹn đã được đặt. Vui lòng xử lý hủy hoặc dời lịch trước khi báo nghỉ!`), 
                { statusCode: 409 }
            );
        }

        const duplicate = await appointmentRepository.findExistingLeave(doctorId, startOfLeaveDate, shift);
        
        if (duplicate) {
            throw Object.assign(new Error("Bạn đã đăng ký lịch nghỉ này trước đó rồi."), { statusCode: 409 });
        }

        return await appointmentRepository.createLeave({ 
            doctorId, 
            date: startOfLeaveDate, 
            shift, 
            reason 
        });
    },

    cancelDoctorLeave: async (leaveId, doctorId) => {
        const leave = await appointmentRepository.findLeaveById(leaveId);

        if (!leave) {
            throw Object.assign(new Error("Không tìm thấy lịch nghỉ này!"), { statusCode: 404 });
        }

        if (leave.doctorId !== doctorId) {
            throw Object.assign(new Error("Bạn không có quyền hủy lịch nghỉ của bác sĩ khác!"), { statusCode: 403 });
        }

        const leaveDate = new Date(leave.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (leaveDate < today) {
            throw Object.assign(new Error("Không thể hủy lịch nghỉ của ngày đã qua!"), { statusCode: 400 });
        }

        await appointmentRepository.deleteLeave(leaveId);

        return true;
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
            throw Object.assign(new Error("Không tìm thấy lịch khám hoặc lịch đã bị hủy!"), { statusCode: 404 })
        }
        if (appointment.status === "completed") {
            throw Object.assign(new Error("Lịch khám đã hoàn thành, không thể hủy!"), { statusCode: 400 })
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
            throw Object.assign(new Error("Không tìm thấy lịch khám hoặc lịch đã bị hủy!"), { statusCode: 404 })
        }

        if (existingAppointment.status === "completed") {
            throw Object.assign(new Error("Lịch khám này đã hoàn thành, không thể thay đổi trạng thái!"), { statusCode: 400 })
        }

        const updatedAppointment = await appointmentRepository.updateStatus(id, status)
        return updatedAppointment
    }
}