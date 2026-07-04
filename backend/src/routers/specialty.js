import express from "express"
import { specialtyController } from "../controllers/specialty.js"
import { authenticate, authorizeAdmin } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { specialtySchema } from "../validates/specialty.js"

const router = express.Router()

// GET /specialties: Lấy danh sách tất cả chuyên khoa
router.get("/", specialtyController.getAllSpecialties)

// GET /specialties/admin: Lấy danh sách chuyên khoa phân trang cho admin
router.get("/admin", authenticate, authorizeAdmin, specialtyController.getAllSpecialtiesForAdmin)

// GET /specialties/detail/:id: Lấy chi tiết chuyên khoa
router.get("/detail/:id", authenticate, authorizeAdmin, specialtyController.getSpecialtyById)

// POST /specialties: Tạo chuyên khoa mới
router.post("/", authenticate, authorizeAdmin, specialtyController.createSpecialty)

// PUT /specialties/:id: Cập nhật chuyên khoa
router.put("/:id", authenticate, authorizeAdmin, specialtyController.updateSpecialty)

// PUT /specialties/:id/restore: Khôi phục chuyên khoa
router.put("/:id/restore", authenticate, authorizeAdmin, specialtyController.restoreSpecialty)

// DELETE /specialties/:id: Xóa chuyên khoa (xóa mềm)
router.delete("/:id", authenticate, authorizeAdmin, specialtyController.deleteSpecialty)

// GET /specialties/:id: Lấy danh sách bác sĩ thuộc chuyên khoa cụ thể (có phân trang)
router.get("/:id", validate(specialtySchema.getDoctors), specialtyController.getDoctorsBySpecialty)

export default router
