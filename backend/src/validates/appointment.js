import { z } from 'zod';

export const appointmentSchema = {
    bookAppointment: {
        body: z.object({
            patientId: z.uuid({ message: "ID bệnh nhân không hợp lệ (phải là UUID)" }),
            doctorId: z.uuid({ message: "ID bác sĩ không hợp lệ (phải là UUID)" }),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Ngày khám phải đúng định dạng YYYY-MM-DD" }),
            shift: z.number({ invalid_type_error: "Ca khám phải là số" }).int().min(1, "Ca khám nhỏ nhất là 1").max(4, "Ca khám lớn nhất là 4"),
            reason: z.string().min(5, "Lý do khám quá ngắn, vui lòng mô tả chi tiết hơn").optional().nullable()
        })
    },

    getSlots: {
        query: z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Ngày khám phải đúng định dạng YYYY-MM-DD" }),
            doctorId: z.string().uuid({ message: "ID bác sĩ không hợp lệ" }).optional(),
            specialtyId: z.string().uuid({ message: "ID chuyên khoa không hợp lệ" }).optional()
        }).refine(data => data.doctorId || data.specialtyId, {
            message: "Phải cung cấp ít nhất ID bác sĩ hoặc ID chuyên khoa",
            path: ["doctorId"]
        })
    },

    getHistory: {
        params: z.object({
            userId: z.string().uuid({ message: "ID bệnh nhân không hợp lệ" })
        }),
        query: z.object({
            lastId: z.string().uuid({ message: "lastId phải là UUID" }).optional(),
            limit: z.string().regex(/^\d+$/, { message: "Limit phải là số" }).optional(),
            desc: z.enum(['true', 'false'], { message: "Desc chỉ được là 'true' hoặc 'false'" }).optional()
        })
    },

    updateStatus: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        }),
        body: z.object({
            status: z.enum(["pending", "accepted", "completed", "cancelled"], {
                errorMap: () => ({ message: "Trạng thái không hợp lệ (chỉ nhận: pending, accepted, completed, cancelled)" })
            })
        })
    },

    medicalRecord: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        }),
        body: z.object({
            diagnosis: z.string().min(2, "Vui lòng nhập chẩn đoán bệnh"),
            prescription: z.string().optional().nullable(),
            doctorAdvice: z.string().optional().nullable()
        })
    },

    checkParamId: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        })
    }
};