import { prisma } from "../configs/prisma-config.js"

export const appointmentRepository = {
    findAppointmentById: async (id) => {
        return await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: true
            }
        })
    },

    updateMedicalRecord: async (appointmentId, diagnosisResult) => {
        return await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                diagnosisResult,
                status: 'completed'
            }
        })
    }
}
