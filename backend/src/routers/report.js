import express from 'express'
import { getReportByTime, getReportById } from '../controllers/report.js'
import { reportSchema } from '../validates/report.js'
import { validate } from '../middlewares/validate-handler.js'

const router = express.Router()

router.get('/by-time', validate({ query: reportSchema.byTimeQuery }), getReportByTime)
router.get('/:id', validate({ params: reportSchema.params }), getReportById)

export default router
