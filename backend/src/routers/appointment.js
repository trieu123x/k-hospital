import express from "express"
import { bookAppointment, getAvailableSlots, getAppointmentDetail, getPatientHistory, cancelAppointment, updateAppointmentStatus, getDoctorSchedule, getAllAppointments, registerDoctorLeave, cancelDoctorLeave, getDoctorLeaves} from "../controllers/appointment.js"
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js"
import { createMedicalRecord, getMedicalRecordDetail, updateMedicalRecord } from "../controllers/medical-record.js"
import { validate } from "../middlewares/validate-handler.js"
import { appointmentSchema } from "../validates/appointment.js"
import { medicalRecordSchema } from "../validates/medical-record.js"

const router = express.Router()

// Lấy lịch khám trống
router.get("/slots", validate(appointmentSchema.getSlots), getAvailableSlots)
// Đặt lịch
//router.post("/book", authenticate, authorizeRoles('patient', 'admin'), validate(appointmentSchema.bookAppointment), bookAppointment)
router.post("/book", validate(appointmentSchema.bookAppointment), bookAppointment)

// Lấy danh sách các lịch khám
router.get("/all", authenticate, authorizeRoles('admin', 'doctor'), validate(appointmentSchema.getAll), getAllAppointments)
// Xem lịch khám của bệnh nhân
//router.get("/patient/:userId", authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate(appointmentSchema.getHistory), getPatientHistory)
router.get("/patient/:userId", validate(appointmentSchema.getHistory), getPatientHistory)

// Xem lịch khám theo bác sĩ
//router.get("/doctor/:doctorId", authenticate, authorizeRoles('admin', 'doctor'), validate(appointmentSchema.getDoctorSchedule), getDoctorSchedule)
//router.patch("/cancel/:appointmentId", authenticate, authorizeRoles('patient', 'admin'), validate(appointmentSchema.checkParamId), cancelAppointment)
//router.patch("/update/status/:appointmentId", authenticate, authorizeRoles('admin', 'doctor'), validate(appointmentSchema.updateStatus), updateAppointmentStatus)
router.get("/doctor/:doctorId", validate(appointmentSchema.getDoctorSchedule), getDoctorSchedule)
router.patch("/cancel/:appointmentId", validate(appointmentSchema.checkParamId), cancelAppointment)
router.patch("/update/status/:appointmentId", validate(appointmentSchema.updateStatus), updateAppointmentStatus)
// Medical Record
//router.post("/medical-record/create/:appointmentId", authenticate, authorizeRoles('doctor'), validate(medicalRecordSchema.create), createMedicalRecord)
router.post("/medical-record/create/:appointmentId", validate(medicalRecordSchema.create), createMedicalRecord)
//router.get("/medical-record/:appointmentId", authenticate, authorizeRoles('doctor', 'patient'), validate(medicalRecordSchema.getDetail), getMedicalRecordDetail)
router.get("/medical-record/:appointmentId", validate(medicalRecordSchema.getDetail), getMedicalRecordDetail)
//router.patch("/medical-record/update/:appointmentId", authenticate, authorizeRoles('doctor'), validate(medicalRecordSchema.update), updateMedicalRecord)
router.patch("/medical-record/update/:appointmentId", validate(medicalRecordSchema.update), updateMedicalRecord)
//router.get("/:appointmentId", authenticate, authorizeRoles('admin', 'doctor', 'patient'), validate(appointmentSchema.checkParamId), getAppointmentDetail)
router.get("/:appointmentId", validate(appointmentSchema.checkParamId), getAppointmentDetail)
router.get('/leaves/:doctorId', validate(appointmentSchema.getLeaves), getDoctorLeaves);

// Đăng kí nghỉ lịch và hủy nghỉ
//router.post("/leave", authenticate, authorizeRoles('doctor'), validate(appointmentSchema.registerLeave), registerDoctorLeave)
//router.delete("/leave/:leaveId", authenticate, authorizeRoles('doctor'), validate(appointmentSchema.cancelLeave), cancelDoctorLeave)
router.post("/leave", registerDoctorLeave)
router.delete("/leave/:leaveId", validate(appointmentSchema.cancelLeave), cancelDoctorLeave)

export default router