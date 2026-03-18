import { appointmentService } from "../services/appointment.js"

export const appointmentController = {
    addMedicalRecord: async (req, res, next) => {
        try {
            const { appointmentId } = req.params
            const requesterId = req.user.id
            const { diagnosisResult } = req.body
            
            const appointment = await appointmentService.addMedicalRecord(appointmentId, requesterId, diagnosisResult)
            
            res.status(200).json({
                success: true,
                message: "Cập nhật bệnh án thành công",
                data: appointment
            })
        } catch (error) {
            next(error)
        }
    }
}
