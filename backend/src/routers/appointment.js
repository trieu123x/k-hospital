import express from "express"
import { appointmentController } from "../controllers/appointment.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

const router = express.Router()

// POST /appointments/:appointmentId/medical-record: Add medical record
// Accessible only by Doctor
router.post("/:appointmentId/medical-record", authenticate, authorizeRoles('doctor'), appointmentController.addMedicalRecord)

export default router
