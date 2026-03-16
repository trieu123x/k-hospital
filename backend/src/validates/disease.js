import { z } from 'zod';

export const diseaseSchema = {
    params: z.object({
        diseaseId: z.uuid({ message: "ID bệnh không hợp lệ (phải là UUID)" })
    }),

    query: z.object({
        categoryId: z.uuid().optional(),
        specialtyId: z.uuid().optional(),
        name: z.string().optional(),
        lastId: z.uuid().optional(),
        limit: z.string()
            .optional()
            .transform((val) => val ? parseInt(val) : 60)
            .pipe(z.number().min(1).max(100))
    }),

    body: z.object({
        name: z.string().min(2, "Tên bệnh quá ngắn").max(200),
        categoryId: z.uuid({ message: "Danh mục bệnh không hợp lệ" }).optional(),
        specialtyId: z.uuid({ message: "Chuyên khoa không hợp lệ" }).optional(),
        symptoms: z.string().min(10, "Vui lòng mô tả triệu chứng chi tiết hơn"),
        description: z.string().optional(),
        homeTreatment: z.string().optional()
    }),

    diagnose: z.object({
        symptoms: z.string().min(5, "Chuỗi triệu chứng quá ngắn để phân tích")
    })
}