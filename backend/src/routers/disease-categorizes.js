import express from 'express'
import { getAllDiseaseCategories, getDiseaseCategoryById } from '../controllers/disease-categorizes.js'
import { validate } from '../middlewares/validate-handler.js'
import { diseaseCategorySchema } from '../validates/disease-categorizes.js'

const router = express.Router()

router.get('/all', getAllDiseaseCategories)
router.get('/:categorizeId', validate({ params: diseaseCategorySchema.params }), getDiseaseCategoryById)

export default router
