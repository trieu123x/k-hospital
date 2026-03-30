import express from 'express'
import multer from 'multer'
import { createDisease, deleteDisease, diagnoseSymptoms, getDiseaseById, getDiseases, updateDisease } from '../controllers/disease.js'
import { diseaseSchema } from '../validates/disease.js'
import { validate } from '../middlewares/validate-handler.js'
import { authenticate, authorizeRoles } from '../middlewares/authenticate.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.get('', validate({ query: diseaseSchema.query }), getDiseases)
router.get('/:diseaseId', validate({ params: diseaseSchema.params }), getDiseaseById)
router.post('/diagnose', authenticate, authorizeRoles('admin'), validate({ body: diseaseSchema.diagnose }), diagnoseSymptoms)
router.post('', authenticate, authorizeRoles('admin'), upload.single('image'), validate({ body: diseaseSchema.body }), createDisease)
router.put('/:diseaseId', authenticate, authorizeRoles('admin'), upload.single('image'), validate({
    params: diseaseSchema.params,
    body: diseaseSchema.body
}), updateDisease)
router.delete('/:diseaseId', authenticate, authorizeRoles('admin'), validate({ params: diseaseSchema.params }), deleteDisease)

export default router
