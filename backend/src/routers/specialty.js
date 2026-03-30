import express from "express"
import { specialtyController } from "../controllers/specialty.js"

import { validate } from "../middlewares/validate-handler.js"
import { specialtySchema } from "../validates/specialty.js"

const router = express.Router()

// GET /specialties: Lấy danh sách tất cả chuyên khoa
router.get("/", specialtyController.getAllSpecialties)

// GET /specialties/:id: Lấy danh sách bác sĩ thuộc chuyên khoa cụ thể (có phân trang)
router.get("/:id", validate(specialtySchema.getDoctors), specialtyController.getDoctorsBySpecialty)

export default router
