import { z } from 'zod';

export const reportSchema = {
    query: z.object({
        mode: z.enum(['daily', 'weekly', 'monthly'], { 
            errorMap: () => ({ message: "Chế độ không hợp lệ (daily, weekly, monthly)" }) 
        }).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày bắt đầu phải là YYYY-MM-DD").optional(),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày kết thúc phải là YYYY-MM-DD").optional(),
        limit: z.string().optional().transform(v => v ? parseInt(v) : 20).pipe(z.number().min(1).max(100))
    }),
    
    params: z.object({
        id: z.string().uuid("ID báo cáo không hợp lệ (phải là UUID)")
    })
};
