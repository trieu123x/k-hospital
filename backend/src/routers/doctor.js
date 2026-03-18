import express from "express"
import { doctorController } from "../controllers/doctor.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

const router = express.Router()

// GET /doctors: Fetch all doctors
// Accessible by admin, patient, doctor
router.get("/", authenticate, authorizeRoles('admin', 'doctor', 'patient'), doctorController.getAllDoctors)

// GET /doctors/:id: Fetch specific doctor
// Accessible by admin, patient, doctor
router.get("/:id", authenticate, authorizeRoles('admin', 'doctor', 'patient'), doctorController.getDoctorById)

// PATCH /doctors/:id: Update specific doctor info (degree, experience, etc.)
// Accessible only by doctor, specifically their own profile handled in service
router.patch("/:id", authenticate, authorizeRoles('admin', 'doctor'), doctorController.updateDoctorInfo)

export default router
