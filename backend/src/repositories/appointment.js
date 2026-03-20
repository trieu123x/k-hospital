import { prisma, Prisma } from "../configs/prisma-config.js"

export const appointmentRepository = {

    // Hàm này chỉ có tác dụng để check slot cho việc đặt lịch khám
    checkSlot: async (doctorId, date, shift) => {
        return await prisma.appointment.findFirst({
            where: {
                doctorId,
                date: new Date(date),
                shift,
                status: { not: "cancelled" } 
            },
            select: { id: true } 
        })
    },

    create: async (data) => {
        const { patientId, doctorId, date, shift, reason } = data
        
        return await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date), 
                shift,
                reason,
                status: "pending"
            },
            select: { 
                id: true, 
                status: true 
            }
        })
    },

    getAllAppointments: async ({ date, status, lastId, limit = 30, desc = true }) => {
        const cursorCondition = lastId ? { id: lastId } : undefined
        const skip = lastId ? 1 : 0 
        const whereClause = {}

        if (date) {
            whereClause.date = new Date(date)
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
                { date: desc ? 'desc' : 'asc' },
                { shift: 'asc' }
            ],
            select: {
                id: true,
                date: true,
                shift: true,
                status: true,
                reason: true,
                patient: { 
                    select: {
                        id: true
                    }
                },
                doctor: { 
                    select: {
                        id: true
                    }
                }
            }
        })
    },

    findById: async (id) => {
        return await prisma.appointment.findUnique({
            where: { id },
            select: {
                id: true,
                date: true,
                shift: true,
                status: true,
                reason: true,
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
                date: true,
                shift: true,
                status: true,
                reason: true,
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
            whereClause.date = new Date(date)
        }

        return await prisma.appointment.findMany({
            where: whereClause,
            take: limit,
            skip: skip,
            cursor: cursorCondition,
            orderBy: [
                { date: desc ? 'desc' : 'asc' }, 
                { shift: 'asc' }                 
            ],
            select: {
                id: true,
                date: true,
                shift: true,
                status: true,
                reason: true,
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
            date: new Date(date),
            status: { not: "cancelled" } 
        }

        if (doctorId) {
            whereClause.doctorId = doctorId
        }

        return await prisma.appointment.findMany({
            where: whereClause,
            select: {
                shift: true,
                doctorId: true,
                doctor: {
                    select: {
                            fullName: true
                    }
                }
            }
        })
    },


    updateStatus: async (id, status) => {
        return await prisma.appointment.update({
            where: { id },
            data: { status },
            select: { 
                id: true, 
                status: true 
            }
        })
    }
}