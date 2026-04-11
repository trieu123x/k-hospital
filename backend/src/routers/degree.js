import express from 'express'
import { getAllDegrees, getDegreeById } from '../controllers/degree.js'
import { validate } from '../middlewares/validate-handler.js'
import { degreeSchema } from '../validates/degree.js'

const router = express.Router()

router.get('/all', getAllDegrees)
router.get('/:id', validate({ params: degreeSchema.params }), getDegreeById)

export default router
