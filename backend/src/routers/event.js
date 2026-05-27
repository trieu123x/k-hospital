import express from 'express'
import { createEvent, getEvents } from '../controllers/event.js'
import { eventSchema } from '../validates/event.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate, authorizeAdmin, authorizePatient } from '../middlewares/authenticate.js'

const router = express.Router()

// User tracking route (only PATIENT)
router.post('/track', authenticate, authorizePatient, validate({ body: eventSchema.body }), createEvent)

// Admin routes
router.post('', authenticate, authorizeAdmin, validate({ body: eventSchema.body }), createEvent)
router.get('', authenticate, authorizeAdmin, validate({ query: eventSchema.query }), getEvents)

export default router
