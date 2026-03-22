import { notificationRepository } from "../repositories/user-notification.js"

export const notificationService = {
    getUsersNotifications: async (userId, lastId) => {
        return await notificationRepository.findByUserId(userId, 10, lastId)
    },

    readNotification: async (id) => {
        const notification = await notificationRepository.markAsRead(id)
        if (!notification) {
            throw Object.assign(new Error(`Thông báo ID ${id} không tồn tại`), { statusCode: 404 })
        }
        return notification
    },
    
    sendNotification: async (payload) => {
        return await notificationRepository.create(payload)
    },

    deleteNotification: async (id) => {
        return await notificationRepository.delete(id)
    },

    deleteReadUserNotifications: async (userId) => {
        return await notificationRepository.deleteReadNotificationsByUserId(userId)
    }
}