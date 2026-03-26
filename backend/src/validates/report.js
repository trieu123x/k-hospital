import { z } from 'zod';

export const reportSchema = {
    byTimeQuery: z.object({
        reportName: z.enum(['raw_events', 'top_doctors', 'top_diseases', 'peak_hours', 'daily_summary', 'chat_topics'], {
            errorMap: () => ({ message: "Tên báo cáo không hợp lệ" })
        }),
        mode: z.enum(['daily', 'weekly', 'monthly'], {
            errorMap: () => ({ message: "Chế độ không hợp lệ (daily, weekly, monthly)" })
        }),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD")
    }),

    params: z.object({
        id: z.uuid({ message: "ID báo cáo không hợp lệ (phải là UUID)" })
    })
};
