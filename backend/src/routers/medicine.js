import express from "express"
import { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine} from "../controllers/medicine.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

import { validate } from "../middlewares/validate-handler.js"
import { medicineSchema } from "../validates/medicine.js"

const router = express.Router()

router.get("/", validate(medicineSchema.getAll), getAllMedicines)
router.get("/:id", validate(medicineSchema.getById), getMedicineById)
router.post("/", authenticate, authorizeRoles('admin'), validate(medicineSchema.create), createMedicine)
router.put("/:id", authenticate, authorizeRoles('admin'), validate(medicineSchema.update), updateMedicine)
router.delete("/:id", authenticate, authorizeRoles('admin'), validate(medicineSchema.getById), deleteMedicine)

export default router