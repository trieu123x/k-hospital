import express from 'express'
import { createEvent, getEvents } from '../controllers/event.js'
import { eventSchema } from '../validates/event.js'
import { validate } from '../middlewares/validate-handler.js'

const router = express.Router()

router.post('', validate({ body: eventSchema.body }), createEvent)
router.get('', validate({ query: eventSchema.query }), getEvents)

export default router
