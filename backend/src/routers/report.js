import express from 'express'
import { getReports, getReportById } from '../controllers/report.js'
import { reportSchema } from '../validates/report.js'
import { validate } from '../middlewares/validate-handler.js'

const router = express.Router()

router.get('', validate({ query: reportSchema.query }), getReports)
router.get('/:id', validate({ params: reportSchema.params }), getReportById)

export default router
