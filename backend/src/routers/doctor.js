import express from "express"
import { doctorController } from "../controllers/doctor.js"
import { authenticate, authorizeAdmin, authorizeDoctor } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { doctorSchema } from "../validates/doctor.js"

const router = express.Router()

// GET /doctors: Fetch all doctors
router.get("/", validate(doctorSchema.getAll), doctorController.getAllDoctors)

// GET /doctors/:id: Fetch specific doctor
router.get("/:id", validate(doctorSchema.getById), doctorController.getDoctorById)

// PATCH /doctors/:id: Update specific doctor info (self-only)
router.patch("/:id", authenticate, authorizeDoctor, validate(doctorSchema.update), doctorController.updateDoctorInfo)

// PUT /doctors/:id: Update specific doctor info (Admin only)
router.put("/:id", authenticate, authorizeAdmin, validate(doctorSchema.update), doctorController.updateDoctorInfoAdmin)

// POST /doctors: Create a new doctor account
router.post("/", authenticate, authorizeAdmin, validate(doctorSchema.create), doctorController.createDoctor)

export default router
