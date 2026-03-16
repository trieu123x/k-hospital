import express from 'express'
const router = express.Router()
import { getAllDiseaseCategories, getDiseaseCategoryById } from '../controllers/disease-categorizes.js'

router.get('/all', getAllDiseaseCategories)
router.get('/:categorizeId', getDiseaseCategoryById)

export default router 