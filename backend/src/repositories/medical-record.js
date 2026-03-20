import { prisma } from "../configs/prisma-config.js"

export const medicalRecordRepository = {
    create: async (data, tx = prisma) => {
        const { appointmentId, diagnosis, prescription, note } = data;
        
        return await tx.medicalRecord.create({
            data: {
                appointmentId,
                diagnosis,
                prescription,
                note
            },
            select: { id: true, diagnosis: true }
        });
    },

    findByAppointmentId: async (appointmentId) => {
        return await prisma.medicalRecord.findUnique({
            where: { appointmentId },
        });
    },

    update: async (appointmentId, data) => {
        return await prisma.medicalRecord.update({
            where: { appointmentId }, 
            data: {
                ...data
            },
            select: { id: true, diagnosis: true, updatedAt: true }
        });
    }
}