import { catchError } from "../helpers/catch-error.js"
import { notificationService } from "../services/user-notification.js"

export const createNotification = catchError(async (req, res) => {
    const { userId, appointmentId, title, message } = req.body

    const newNotification = await notificationService.sendNotification({
        userId,
        appointmentId,
        title,
        message
    })

    res.status(201).json({
        success: true,
        message: "Tạo thông báo thành công",
        data: newNotification
    })
})

export const getMyNotifications = catchError(async (req, res) => {
    const { userId, lastId } = req.query

    const notifications = await notificationService.getUsersNotifications(userId, lastId)

    res.status(200).json({
        success: true,
        message: "Lấy danh sách thông báo thành công",
        data: notifications
    })
})

export const markAsRead = catchError(async (req, res) => {
    const { notificationId } = req.params

    const updatedNotification = await notificationService.readNotification(notificationId)

    res.status(200).json({
        success: true,
        message: "Đã đánh dấu thông báo là đã đọc",
        data: updatedNotification
    })
})

export const deleteNotification = catchError(async (req, res) => {
    const { notificationId } = req.params

    await notificationService.deleteNotification(notificationId)

    res.status(200).json({
        success: true,
        message: "Xóa thông báo thành công"
    })
})

export const clearReadNotifications = catchError(async (req, res) => {
    const { userId } = req.query

    const result = await notificationService.deleteReadUserNotifications(userId)

    res.status(200).json({
        success: true,
        message: `Đã dọn dẹp các thông báo đã đọc`,
        data: { deletedCount: result.count }
    })
})