import { z } from "zod";

export const newsSchema = {
    params: z.object({
        newsId: z.string().uuid({ message: "ID tin tức không hợp lệ (phải là UUID)" })
    }),

    query: z.object({
        title: z.string().optional(),
        lastId: z.string().uuid({ message: "lastId không hợp lệ" }).optional(),
        limit: z.string() 
            .optional()
            .transform((val) => (val ? parseInt(val) : 30)) 
            .pipe(z.number().min(1).max(100))
    }),

    body: z.object({
        title: z.string()
            .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
            .max(255, "Tiêu đề quá dài"),
        content: z.string()
            .min(20, "Nội dung tin tức quá ngắn"),
    }),


    updateBody: z.object({
        title: z.string().min(10, "Tiêu đề quá ngắn").max(255),
        content: z.string().min(20, "Nội dung quá ngắn"),
    }).partial()
};