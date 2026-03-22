import { z } from 'zod'

export const notificationSchema = {
    body: z.object({
        userId: z.uuid({ message: "userId phải là định dạng UUID hợp lệ" }),
        appointmentId: z.uuid({ message: "appointmentId không hợp lệ" }).optional().nullable(),
        title: z.string().min(1, "Tiêu đề không được để trống").max(200),
        message: z.string().min(1, "Nội dung thông báo không được để trống")
    }),

    query: z.object({
        userId: z.uuid({ message: "userId phải là UUID" }),
        lastId: z.uuid({ message: "lastId không hợp lệ" }).optional().nullable()
    }),

    params: z.object({
        notificationId: z.uuid({ message: "ID thông báo không hợp lệ" })
    })
}