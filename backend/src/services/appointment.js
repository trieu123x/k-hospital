import { appointmentRepository } from "../repositories/appointment.js"

export const appointmentService = {
    addMedicalRecord: async (appointmentId, requesterId, diagnosisResult) => {
        // Find appointment
        const appointment = await appointmentRepository.findAppointmentById(appointmentId)
        if (!appointment) {
            throw Object.assign(new Error("Không tìm thấy cuộc hẹn"), { statusCode: 404 })
        }

        // Verify doctor permission (only the doctor of this appointment can resolve it)
        if (appointment.doctorId !== requesterId) {
            throw Object.assign(new Error("Bạn không có quyền cập nhật bệnh án cho cuộc hẹn này"), { statusCode: 403 })
        }

        if (!diagnosisResult) {
            throw Object.assign(new Error("Bệnh án/Kết quả chẩn đoán không được để trống"), { statusCode: 400 })
        }

        const updatedAppointment = await appointmentRepository.updateMedicalRecord(appointmentId, diagnosisResult)
        return updatedAppointment
    }
}
