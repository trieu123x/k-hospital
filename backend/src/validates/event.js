import { z } from 'zod';

export const eventSchema = {
    body: z.object({
        userId: z.uuid({ message: "ID người dùng phải là UUID" }).optional().nullable(),
        eventType: z.enum([
            'VIEW_DOCTOR', 'BOOK_APPOINTMENT',
            'CANCEL_APPOINTMENT', 'VIEW_DISEASE',
            'CHAT_AI_TOPIC'
        ], { errorMap: () => ({ message: "Loại sự kiện không hợp lệ" }) }),
        entityId: z.uuid({ message: "Entity ID phải là UUID" }).optional().nullable(),
        metadata: z.any().optional().nullable()
    }),

    query: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD")
    })
};
