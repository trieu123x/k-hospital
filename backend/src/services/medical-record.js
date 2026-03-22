import { prisma } from "../configs/prisma-config.js"
import { medicalRecordRepository } from "../repositories/medical-record.js"
import { appointmentRepository } from "../repositories/appointment.js"

export const medicalRecordService = {
    createRecord: async (appointmentId, data) => {
        const { diagnosis, prescription, doctorAdvice } = data

        const appointment = await appointmentRepository.findById(appointmentId)
        if (!appointment) {
            throw Object.assign(new Error("Không tìm thấy lịch khám!"), { statusCode: 404 })
        }

        if (appointment.status === "completed") {
            throw Object.assign(new Error("Lịch khám này đã được hoàn thành trước đó!"), { statusCode: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            const newRecord = await medicalRecordRepository.create({
                appointmentId,
                diagnosis,
                prescription,
                note: doctorAdvice 
            }, tx)

            await tx.appointment.update({
                where: { id: appointmentId },
                data: { status: "completed" }
            })

            return newRecord
        })

        return result
    },

    getRecordDetail: async (appointmentId) => {
        const record = await medicalRecordRepository.findByAppointmentId(appointmentId)
        if (!record) {
            throw Object.assign(new Error("Chưa có hồ sơ bệnh án cho lịch khám này!"), { statusCode: 404 })
        }
        return record
    },

    updateRecord: async (appointmentId, data) => {
        const existingRecord = await medicalRecordRepository.findByAppointmentId(appointmentId)
        if (!existingRecord) {
            throw Object.assign(new Error("Không tìm thấy hồ sơ bệnh án để sửa!"), { statusCode: 404 })
        }

        const updateData = {
            diagnosis: data.diagnosis,
            prescription: data.prescription,
            note: data.doctorAdvice 
        }

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])

        const updatedRecord = await medicalRecordRepository.update(appointmentId, updateData)
        return updatedRecord
    }
}