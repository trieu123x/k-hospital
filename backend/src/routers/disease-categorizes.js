import express from 'express'
import { 
    getAllDiseaseCategories, 
    getDiseaseCategoryById, 
    getAllDiseaseCategoriesForAdmin, 
    createDiseaseCategory, 
    updateDiseaseCategory, 
    deleteDiseaseCategory,
    restoreDiseaseCategory
} from '../controllers/disease-categorizes.js'
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js"
import { validate } from '../middlewares/validate-handler.js'
import { diseaseCategorySchema } from '../validates/disease-categorizes.js'

const router = express.Router()

router.get('/all', getAllDiseaseCategories)

router.get('/admin', authenticate, authorizeAdmin, getAllDiseaseCategoriesForAdmin)

router.get('/detail/:id', authenticate, authorizeAdmin, getDiseaseCategoryById)

router.post('/', authenticate, authorizeAdmin, createDiseaseCategory)

router.put('/:id', authenticate, authorizeAdmin, updateDiseaseCategory)

router.put('/:id/restore', authenticate, authorizeAdmin, restoreDiseaseCategory)

router.delete('/:id', authenticate, authorizeAdmin, deleteDiseaseCategory)

router.get('/:categorizeId', validate({ params: diseaseCategorySchema.params }), getDiseaseCategoryById)

export default router
