import express from 'express'
import { clearReadNotifications, createNotification, deleteNotification, getMyNotifications, markAsRead } from '../controllers/user-notification.js'
const router = express.Router()

router.get('', getMyNotifications)
router.post('', createNotification)
router.patch('/:notificationId/read', markAsRead)
router.delete('/:notificationId', deleteNotification)
router.delete('/clean/read', clearReadNotifications)

export default router