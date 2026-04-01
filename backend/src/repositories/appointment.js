import { prisma, Prisma } from "../configs/prisma-config.js"

export const appointmentRepository = {
    findAppointmentById: async (id) => {
        return await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: true,
            }
        })
    },

    create: async (data) => {
        const { patientId, doctorId, date, shift, reason } = data
        const appointmentDate = new Date(date)
        
        return await prisma.$transaction(async (tx) => {
            const doctorLeave = await tx.doctorLeave.findFirst({
                where: {
                    doctorId,
                    date: appointmentDate,
                    OR: [
                        { shift: null }, // Trường hợp nghỉ nguyên ngày
                        { shift: shift } 
                    ]
                }
            })

            if (doctorLeave) {
                throw Object.assign(new Error("Bác sĩ đã báo bận/nghỉ ca khám này, vui lòng chọn ca khác!"), { statusCode: 409 })
            }

            const existingAppointment = await tx.appointment.findFirst({
                where: { 
                    doctorId,
                    date: appointmentDate,
                    shift
                }
            })

            if (existingAppointment) {
                throw Object.assign(new Error("Khung giờ này vừa có người đặt, vui lòng chọn ca khác!"), { statusCode: 409 })
            }

            return await tx.appointment.create({
                data: {
                    patientId,
                    doctorId,
                    date: appointmentDate,
                    shift,
                    reason,
                    status: "pending"
                },
                select: { 
                    id: true, 
                    status: true,
                    date: true,
                    shift: true
                }
            })
        })
    },

    updateMedicalRecord: async (appointmentId) => {
        return await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'completed' }
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
                status: true,
                reason: true,
                date: true,   
                shift: true, 
                patient: { select: { id: true } },
                doctor:  { select: { id: true } }
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
                date: true,
                shift: true,
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
                                specialty: { select: { name: true } }
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
            where: { patientId },
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
                date: true,
                shift: true,
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
                                specialty: { select: { name: true } }
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
        const whereClause = { doctorId }

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
                status: true,
                reason: true,
                date: true,
                shift: true,
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


    getUnavailableSlots: async ({ date, doctorId }) => {
        const targetDate = new Date(date)

        const whereBase = { date: targetDate }
        if (doctorId) whereBase.doctorId = doctorId

        const [appointments, leaves] = await Promise.all([
            prisma.appointment.findMany({
                where: whereBase,
                select: { shift: true, doctorId: true }
            }),
            prisma.doctorLeave.findMany({
                where: whereBase,
                select: { shift: true, doctorId: true }
            })
        ])

        return {
            bookedShifts: appointments,
            doctorLeaves: leaves
        }
    },

    updateStatus: async (id, status) => {
        if (status === "cancelled" || status === "canceled") {
            return await prisma.appointment.delete({
                where: { id },
                select: { 
                    id: true,
                    date: true,
                    shift: true
                }
            })
        }

        return await prisma.appointment.update({
            where: { id },
            data: { status },
            select: { 
                id: true, 
                status: true,
                date: true,
                shift: true 
            }
        })
    },
    
    createLeave: async (data) => {
        const { doctorId, date, shift, reason } = data;
        return await prisma.doctorLeave.create({
            data: {
                doctorId,
                date: new Date(date),
                shift: shift || null, 
                reason
            }
        });
    },

    findExistingLeave: async (doctorId, date, shift) => {
        return await prisma.doctorLeave.findFirst({
            where: {
                doctorId,
                date: new Date(date),
                shift: shift || null
            }
        });
    },

    findLeaveById: async (id) => {
        return await prisma.doctorLeave.findUnique({
            where: { id }
        });
    },

    deleteLeave: async (id) => {
        return await prisma.doctorLeave.delete({
            where: { id }
        });
    }
}