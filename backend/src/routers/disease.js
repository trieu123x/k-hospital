import express from 'express'
import multer from 'multer'
import { createDisease, deleteDisease, diagnoseSymptoms, getDiseaseById, getDiseases, updateDisease } from '../controllers/disease.js'
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.get('', getDiseases)
router.get('/:diseaseId', getDiseaseById)
router.post('/diagnose', diagnoseSymptoms)
router.post('', upload.single('image'), createDisease)
router.put('/:diseaseId', upload.single('image'), updateDisease)
router.delete('/:diseaseId', deleteDisease)

export default router