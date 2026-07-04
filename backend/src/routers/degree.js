import express from 'express'
import { 
    getAllDegrees, 
    getDegreeById, 
    getAllDegreesForAdmin, 
    createDegree, 
    updateDegree, 
    deleteDegree,
    restoreDegree
} from '../controllers/degree.js'
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js"
import { validate } from '../middlewares/validate-handler.js'
import { degreeSchema } from '../validates/degree.js'

const router = express.Router()

router.get('/all', getAllDegrees)

router.get('/admin', authenticate, authorizeAdmin, getAllDegreesForAdmin)

router.get('/detail/:id', authenticate, authorizeAdmin, validate({ params: degreeSchema.params }), getDegreeById)

router.post('/', authenticate, authorizeAdmin, createDegree)

router.put('/:id', authenticate, authorizeAdmin, validate({ params: degreeSchema.params }), updateDegree)

router.put('/:id/restore', authenticate, authorizeAdmin, validate({ params: degreeSchema.params }), restoreDegree)

router.delete('/:id', authenticate, authorizeAdmin, validate({ params: degreeSchema.params }), deleteDegree)

router.get('/:id', validate({ params: degreeSchema.params }), getDegreeById)

export default router
