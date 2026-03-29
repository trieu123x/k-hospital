import { z } from 'zod';

export const reportSchema = {
    byTimeQuery: z.object({
        reportName: z.enum(['raw_events', 'top_doctors', 'top_diseases', 'peak_hours', 'daily_summary', 'chat_topics'], {
            errorMap: () => ({ message: "Tên báo cáo không hợp lệ" })
        }),
        mode: z.enum(['daily', 'weekly', 'monthly'], {
            errorMap: () => ({ message: "Chế độ không hợp lệ (daily, weekly, monthly)" })
        }),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày bắt đầu phải là YYYY-MM-DD"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày kết thúc phải là YYYY-MM-DD")
    }).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
        message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
        path: ["endDate"]
    }),

    params: z.object({
        id: z.uuid({ message: "ID báo cáo không hợp lệ (phải là UUID)" })
    })
};