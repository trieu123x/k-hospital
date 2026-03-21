import express from "express"
import { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine} from "../controllers/medicine.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"

const router = express.Router()

router.get("/", getAllMedicines)
router.get("/:id", getMedicineById)
router.post("/", authenticate, authorizeRoles('admin'), createMedicine)
router.put("/:id", authenticate, authorizeRoles('admin'), updateMedicine)
router.delete("/:id", authenticate, authorizeRoles('admin'), deleteMedicine)

export default router