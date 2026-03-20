import express from "express"
import { bookAppointment, getAvailableSlots, getAppointmentDetail, getPatientHistory, cancelAppointment, updateAppointmentStatus, getDoctorSchedule, getAllAppointments} from "../controllers/appointment.js"
import { createMedicalRecord, getMedicalRecordDetail, updateMedicalRecord } from "../controllers/medical-record.js"
import { validate } from "../middlewares/validate-handler.js"
import { appointmentSchema } from "../validates/appointment.js"

const router = express.Router()

router.post("/book", validate(appointmentSchema.bookAppointment), bookAppointment)
router.get("/slots", validate(appointmentSchema.getSlots), getAvailableSlots)
router.get("/all", validate(appointmentSchema.getAll), getAllAppointments)
router.get("/:appointmentId", validate(appointmentSchema.checkParamId), getAppointmentDetail)
router.get("/patient/:userId", validate(appointmentSchema.getHistory), getPatientHistory)
router.get("/doctor/:doctorId", validate(appointmentSchema.getDoctorSchedule), getDoctorSchedule)
router.patch("/cancel/:appointmentId", validate(appointmentSchema.checkParamId), cancelAppointment)
router.patch("/update/status/:appointmentId", validate(appointmentSchema.updateStatus), updateAppointmentStatus)
router.post("/medical-record/create/:appointmentId", validate(appointmentSchema.medicalRecord), createMedicalRecord)
router.get("/medical-record/:appointmentId", validate(appointmentSchema.checkParamId), getMedicalRecordDetail)
router.patch("/medical-record/update/:appointmentId", validate(appointmentSchema.medicalRecord), updateMedicalRecord)

export default router