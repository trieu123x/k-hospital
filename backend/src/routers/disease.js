import express from 'express'
import multer from 'multer'
import { createDisease, deleteDisease, diagnoseSymptoms, getDiseaseById, getDiseases, updateDisease } from '../controllers/disease.js'
import { diseaseSchema } from '../validates/disease.js'
import { validate } from '../middlewares/validate-handler.js'
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.get('', validate({ query: diseaseSchema.query }), getDiseases)
router.get('/:diseaseId', validate({ params: diseaseSchema.params }), getDiseaseById)
router.post('/diagnose', validate({ body: diseaseSchema.diagnose }), diagnoseSymptoms)
router.post('', upload.single('image'), validate({ body: diseaseSchema.body }), createDisease)
router.put('/:diseaseId', upload.single('image'), validate({ 
    params: diseaseSchema.params,
    body: diseaseSchema.body
}), updateDisease)
router.delete('/:diseaseId',validate({ params: diseaseSchema.params }), deleteDisease) 

export default router