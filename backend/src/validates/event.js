import { z } from 'zod';

export const eventSchema = {
    body: z.object({
        userId: z.uuid("ID người dùng phải là UUID").optional().nullable(),
        eventType: z.enum([
            'VIEW_DOCTOR', 'SEARCH_DOCTOR', 'BOOK_APPOINTMENT',
            'CANCEL_APPOINTMENT', 'VIEW_DISEASE', 'SEARCH_DISEASE',
            'CHAT_AI_TOPIC'
        ], { errorMap: () => ({ message: "Loại sự kiện không hợp lệ" }) }),
        entityId: z.uuid("Entity ID phải là UUID").optional().nullable(),
        metadata: z.record(z.any()).optional().nullable()
    }),

    query: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD")
    })
};
