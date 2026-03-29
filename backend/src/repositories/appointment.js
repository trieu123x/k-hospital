import { prisma, Prisma } from "../configs/prisma-config.js"

export const appointmentRepository = {
    findAppointmentById: async (id) => {
        return await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        })
    },

    create: async (data) => {
        const { patientId, doctorId, scheduleId, reason } = data
        
        return await prisma.$transaction(async (tx) => {
            const updateSchedule = await tx.schedule.updateMany({
                where: { 
                    id: scheduleId,
                    isBooked: false 
                },
                data: { isBooked: true }
            })

            if (updateSchedule.count === 0) {
                throw Object.assign(new Error("Khung giờ này vừa có người đặt, vui lòng chọn ca khác!"), { statusCode: 409 })
            }

            return await tx.appointment.upsert({
                where: { 
                    scheduleId: scheduleId 
                },
                update: {
                    patientId: patientId,
                    doctorId: doctorId,
                    reason: reason,
                    status: "pending"
                },
                create: {
                    patientId,
                    doctorId,
                    scheduleId, 
                    reason,
                    status: "pending"
                },
                select: { 
                    id: true, 
                    status: true 
                }
            })
        })
    },

    updateMedicalRecord: async (appointmentId) => {
        return await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'completed'
            }
        })
    },

    getAllAppointments: async ({ date, status, lastId, limit = 30, desc = true }) => {
        const cursorCondition = lastId ? { id: lastId } : undefined
        const skip = lastId ? 1 : 0 
        const whereClause = {}

        if (date) {
            whereClause.schedule = { date: new Date(date) } 
        }
        if (status) {
            whereClause.status = status
        }

        return await prisma.appointment.findMany({
            where: whereClause,
            take: limit,
            skip: skip,
            cursor: cursorCondition,
            orderBy: [
                { schedule: { date: desc ? 'desc' : 'asc' } }, 
                { schedule: { shift: 'asc' } }
            ],
            select: {
                id: true,
                status: true,
                reason: true,
                schedule: {
                    select: { date: true, shift: true } 
                },
                patient: { 
                    select: { id: true }
                },
                doctor: { 
                    select: { id: true }
                }
            }
        })
    },

    findById: async (id) => {
        return await prisma.appointment.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                reason: true,
                schedule: {
                    select: { date: true, shift: true }
                },
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        dob: true
                    }
                },
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        doctor: {
                            select: {
                                specialty: {
                                select: { name: true }
                                }
                            }
                        }
                    }
                },
                medicalRecord: {
                    select: {
                        diagnosis: true,
                        prescription: true,
                        note: true,
                        createdAt: true
                    }
                }
            }
        })
    },

    findByPatientId: async ({ patientId, lastId, limit = 30, desc = true }) => {
        const cursorCondition = lastId ? { id: lastId } : undefined
        const skip = lastId ? 1 : 0 

        return await prisma.appointment.findMany({
            where: {
                patientId: patientId
            },
            take: limit,
            skip: skip,
            cursor: cursorCondition,
            orderBy: {
                createdAt: desc ? 'desc' : 'asc'
            },
            select: {
                id: true,
                status: true,
                reason: true,
                schedule: {
                    select: { date: true, shift: true }
                },
                medicalRecord: {
                    select: { diagnosis: true }
                },
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        doctor: {
                            select: {
                                specialty: {
                                select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        })
    },

    findByDoctorId: async ({ doctorId, date, lastId, limit = 30, desc = true }) => {
        const cursorCondition = lastId ? { id: lastId } : undefined
        const skip = lastId ? 1 : 0 
        const whereClause = { doctorId: doctorId }

        if (date) {
            whereClause.schedule = { date: new Date(date) }
        }

        return await prisma.appointment.findMany({
            where: whereClause,
            take: limit,
            skip: skip,
            cursor: cursorCondition,
            orderBy: [
                { schedule: { date: desc ? 'desc' : 'asc' } }, 
                { schedule: { shift: 'asc' } }                
            ],
            select: {
                id: true,
                status: true,
                reason: true,
                schedule: {
                    select: { date: true, shift: true }
                },
                patient: { 
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        dob: true,
                        avatarUrl: true
                    }
                }
            }
        })
    },

    findBookedAppointments: async ({ date, doctorId }) => {
        const whereClause = {
            schedule: { date: new Date(date) },
            status: { not: "cancelled" } 
        }

        if (doctorId) {
            whereClause.doctorId = doctorId
        }

        return await prisma.appointment.findMany({
            where: whereClause,
            select: {
                doctorId: true,
                schedule: {
                    select: { shift: true }
                },
                doctor: {
                    select: {
                        fullName: true
                    }
                }
            }
        })
    },

    updateStatus: async (id, status) => {
        return await prisma.$transaction(async (tx) => {
            const appointment = await tx.appointment.update({
                where: { id },
                data: { status },
                select: { 
                    id: true, 
                    status: true,
                    scheduleId: true 
                }
            })

            if (status === "cancelled" || status === "canceled") {
                await tx.schedule.update({
                    where: { id: appointment.scheduleId },
                    data: { isBooked: false } 
                })
            }

            return appointment
        })
    }
}