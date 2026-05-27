import express from 'express'
import multer from 'multer'
import { createDisease, deleteDisease, diagnoseSymptoms, getDiseaseById, getDiseases, getDiseasesForAdmin, getTotalDiseases, updateDisease } from '../controllers/disease.js'
import { diseaseSchema } from '../validates/disease.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate, authorizeAdmin } from '../middlewares/authenticate.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

// ================================
// PUBLIC ROUTES
// ================================
router.get('', validate({ query: diseaseSchema.query }), getDiseases)
router.get('/:diseaseId', validate({ params: diseaseSchema.params }), getDiseaseById)
router.post('/diagnose', validate({ body: diseaseSchema.diagnose }), diagnoseSymptoms)

// ================================
// ADMIN ROUTES
// ================================
router.get('/admin', authenticate, authorizeAdmin, validate({ query: diseaseSchema.query }), getDiseasesForAdmin)
router.get('/count', authenticate, authorizeAdmin, getTotalDiseases)
router.post('', authenticate, authorizeAdmin, upload.single('image'), validate({ body: diseaseSchema.body }), createDisease)
router.put('/:diseaseId', authenticate, authorizeAdmin, upload.single('image'), validate({ params: diseaseSchema.params, body: diseaseSchema.body }), updateDisease)
router.delete('/:diseaseId', authenticate, authorizeAdmin, validate({ params: diseaseSchema.params }), deleteDisease)

export default router
