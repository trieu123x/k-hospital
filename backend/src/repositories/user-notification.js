import { prisma } from "../configs/prisma-config.js"

export const notificationRepository = {
    findByUserId: async (userId, limit = 10, lastId = null) => {
        return await prisma.notification.findMany({
            where: { 
                userId,
                ...(lastId && { id: { lt: lastId } }) 
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                message: true,
                isRead: true,
                createdAt: true,
                appointmentId: true,
                appointment: {
                    select: {
                        status: true
                    }
                }
            }
        })
    },

    create: async (data) => {
        return await prisma.notification.create({
            data: {
                userId: data.userId,
                appointmentId: data.appointmentId,
                title: data.title,
                message: data.message
            }
        })
    },

    markAsRead: async (id) => {
        return await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })
    },

    markAllAsRead: async (userId) => {
        return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        })
    },

    delete: async (id) => {
        return await prisma.notification.delete({
            where: { id }
        })
    },

    deleteReadNotificationsByUserId: async (userId) => {
        return await prisma.notification.deleteMany({
            where: { 
                userId: userId,
                isRead: true 
            }
        });
    }
}