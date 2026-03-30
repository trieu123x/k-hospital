import express from 'express'
import { getReportByTime, getReportById } from '../controllers/report.js'
import { reportSchema } from '../validates/report.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate } from '../middlewares/auth-handler.js'
import { authorizeRoles } from '../middlewares/authorize-handler.js'

const router = express.Router()

router.get('/by-time', authenticate, authorizeRoles('admin'), validate({ query: reportSchema.byTimeQuery }), getReportByTime)
router.get('/:id', authenticate, authorizeRoles('admin'), validate({ params: reportSchema.params }), getReportById)

export default router
