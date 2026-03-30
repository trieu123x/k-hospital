import express from "express"
import { createSchedules, getDoctorSchedules, deleteSchedule } from "../controllers/schedule.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"
import { validate } from "../middlewares/validate-handler.js"
import { scheduleSchema } from "../validates/schedule.js"

const router = express.Router()

router.post("/create", authenticate, authorizeRoles('doctor'), validate(scheduleSchema.create), createSchedules)
router.get("/doctor/:doctorId", authenticate, authorizeRoles('doctor'), validate(scheduleSchema.getDoctor), getDoctorSchedules)
router.delete("/:scheduleId", authenticate, authorizeRoles('doctor'), validate(scheduleSchema.checkParamId), deleteSchedule)

export default router