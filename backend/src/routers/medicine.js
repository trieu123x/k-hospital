import express from "express"
import { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, getTotalMedicines, getMedicinesForAdmin } from "../controllers/medicine.js"
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { medicineSchema } from "../validates/medicine.js"

const router = express.Router()

// ================================
// PUBLIC ROUTES
// ================================
router.get("/", validate(medicineSchema.getAll), getAllMedicines)

import multer from "multer"
const upload = multer({ storage: multer.memoryStorage() })

// ================================
// ADMIN ROUTES
// ================================
router.get("/admin", authenticate, authorizeAdmin, validate(medicineSchema.getAll), getMedicinesForAdmin)
router.get("/count", authenticate, authorizeAdmin, getTotalMedicines)
router.get("/:id", validate(medicineSchema.getById), getMedicineById)
router.post("/", authenticate, authorizeAdmin, upload.single("image"), validate(medicineSchema.create), createMedicine)
router.put("/:id", authenticate, authorizeAdmin, upload.single("image"), validate(medicineSchema.update), updateMedicine)
router.delete("/:id", authenticate, authorizeAdmin, validate(medicineSchema.getById), deleteMedicine)

export default router