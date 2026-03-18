import express from "express"
import { specialtyController } from "../controllers/specialty.js"

const router = express.Router()

// GET /specialties: Lấy danh sách tất cả chuyên khoa
router.get("/", specialtyController.getAllSpecialties)

// GET /specialties/:id: Lấy danh sách bác sĩ thuộc chuyên khoa cụ thể (có phân trang)
router.get("/:id", specialtyController.getDoctorsBySpecialty)

export default router
