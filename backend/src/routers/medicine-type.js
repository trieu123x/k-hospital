import express from 'express'
import { getAllMedicineTypes, getMedicineTypeById } from '../controllers/medicine-type.js'
import { validate } from '../middlewares/validate-handler.js'
import { medicineTypeSchema } from '../validates/medicine-type.js'

const router = express.Router()

router.get('/all', getAllMedicineTypes)
router.get('/:id', validate({ params: medicineTypeSchema.params }), getMedicineTypeById)

export default router
