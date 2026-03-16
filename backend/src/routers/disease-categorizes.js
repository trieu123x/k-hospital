import express from 'express'
const router = express.Router()
import { getAllDiseaseCategories, getDiseaseCategoryById } from '../controllers/disease-categorizes.js'
import { validate } from '../middlewares/validate-handler.js'
import { diseaseCategorySchema } from '../validates/disease-categorizes.js'

router.get('/all' ,getAllDiseaseCategories)
router.get('/:categorizeId', validate({ params: diseaseCategorySchema.params }), getDiseaseCategoryById)

export default router 