import express from 'express'
import { createEvent, getEvents } from '../controllers/event.js'
import { eventSchema } from '../validates/event.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate, authorizeRoles } from '../middlewares/authenticate.js'

const router = express.Router()

router.post('', authenticate, authorizeRoles('ADMIN'), validate({ body: eventSchema.body }), createEvent)
router.get('', authenticate, authorizeRoles('ADMIN'), validate({ query: eventSchema.query }), getEvents)

export default router
