import express from 'express'
import { clearReadNotifications, createNotification, deleteNotification, getMyNotifications, markAsRead } from '../controllers/user-notification.js'
import { notificationSchema } from '../validates/user-notification.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate } from '../middlewares/auth-handler.js'
import { authorizeRoles } from '../middlewares/authorize-handler.js'

const router = express.Router()

router.get('', authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate({ query: notificationSchema.query }), getMyNotifications)
router.post('', authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate({ body: notificationSchema.body }), createNotification)
router.patch('/:notificationId/read', authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate({ params: notificationSchema.params }), markAsRead)
router.delete('/:notificationId', authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate({ params: notificationSchema.params }), deleteNotification)
router.delete('/clean/read', authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate({ query: notificationSchema.query }), clearReadNotifications)

export default router
