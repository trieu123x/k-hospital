import express from 'express'
import { 
    getAllMedicineTypes, 
    getMedicineTypeById, 
    getAllMedicineTypesForAdmin, 
    createMedicineType, 
    updateMedicineType, 
    deleteMedicineType,
    restoreMedicineType 
} from '../controllers/medicine-type.js'
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js"
import { validate } from '../middlewares/validate-handler.js'
import { medicineTypeSchema } from '../validates/medicine-type.js'

const router = express.Router()

router.get('/all', getAllMedicineTypes)

router.get('/admin', authenticate, authorizeAdmin, getAllMedicineTypesForAdmin)

router.get('/detail/:id', authenticate, authorizeAdmin, validate({ params: medicineTypeSchema.params }), getMedicineTypeById)

router.post('/', authenticate, authorizeAdmin, createMedicineType)

router.put('/:id', authenticate, authorizeAdmin, validate({ params: medicineTypeSchema.params }), updateMedicineType)

router.put('/:id/restore', authenticate, authorizeAdmin, validate({ params: medicineTypeSchema.params }), restoreMedicineType)

router.delete('/:id', authenticate, authorizeAdmin, validate({ params: medicineTypeSchema.params }), deleteMedicineType)

router.get('/:id', validate({ params: medicineTypeSchema.params }), getMedicineTypeById)

export default router
