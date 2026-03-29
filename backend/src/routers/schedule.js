import express from "express"
import { createSchedules, getDoctorSchedules, deleteSchedule } from "../controllers/schedule.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"
import { validate } from "../middlewares/validate-handler.js"
import { scheduleSchema } from "../validates/schedule.js" 

const router = express.Router()

router.post("/create", validate(scheduleSchema.create), createSchedules)
router.get("/doctor/:doctorId", validate(scheduleSchema.getDoctor), getDoctorSchedules)
router.delete("/:scheduleId", validate(scheduleSchema.checkParamId), deleteSchedule)

export default router