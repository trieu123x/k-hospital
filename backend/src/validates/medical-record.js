import { z } from "zod";

export const medicalRecordSchema = {
    create: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        }),
        body: z.object({
            diagnosis: z.string().min(2, "Vui lòng nhập chẩn đoán bệnh"),
            prescription: z.string().optional().nullable(),
            doctorAdvice: z.string().optional().nullable()
        })
    },

    update: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        }),
        body: z.object({
            diagnosis: z.string().min(2, "Vui lòng nhập chẩn đoán bệnh").optional(),
            prescription: z.string().optional().nullable(),
            doctorAdvice: z.string().optional().nullable()
        })
    },

    getDetail: {
        params: z.object({
            appointmentId: z.string().uuid({ message: "ID lịch khám không hợp lệ" })
        })
    }
};
