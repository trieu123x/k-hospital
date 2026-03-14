import express from 'express'
const router = express.Router()
import { getAllDiseaseCategories, getDiseaseCategoryById } from '../controllers/disease-categorizes.js'

router.get('/all', getAllDiseaseCategories)
router.get('/:categoryId', getDiseaseCategoryById)

export default router 