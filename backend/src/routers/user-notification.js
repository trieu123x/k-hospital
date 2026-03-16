import express from 'express'
import { clearReadNotifications, createNotification, deleteNotification, getMyNotifications, markAsRead } from '../controllers/user-notification.js'
import { notificationSchema } from '../validates/user-notification.js'
import { validate } from '../middlewares/validate-handler.js'
const router = express.Router()

router.get('', validate({ query: notificationSchema.query }), getMyNotifications)
router.post('', validate({ body: notificationSchema.body }), createNotification)
router.patch('/:notificationId/read', validate({ params: notificationSchema.params }), markAsRead)
router.delete('/:notificationId', validate({ params: notificationSchema.params }), deleteNotification)
router.delete('/clean/read', validate({ query: notificationSchema.query }), clearReadNotifications)

export default router