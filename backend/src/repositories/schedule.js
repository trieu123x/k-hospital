import { prisma } from "../configs/prisma-config.js"

export const scheduleRepository = {
    createSchedules: async (dataToInsert) => {
        return await prisma.schedule.createMany({
            data: dataToInsert,
            skipDuplicates: true 
        });
    },

    getDoctorSchedules: async (doctorId, fromDate, toDate) => {
        return await prisma.schedule.findMany({
            where: {
                doctorId: doctorId,
                date: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate)
                }
            },
            orderBy: [
                { date: 'asc' },
                { shift: 'asc' }
            ],
            include: {
                appointment: {
                    select: {
                        id: true,
                        status: true,
                        patient: {
                            select: { fullName: true, phone: true }
                        }
                    }
                }
            }
        });
    },

    deleteSchedule: async (scheduleId) => {
        return await prisma.schedule.delete({
            where: { id: scheduleId }
        });
    }
}