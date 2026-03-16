import { z } from 'zod'

export const diseaseCategorySchema = {
    params: z.object({
        categorizeId: z.uuid({ message: "ID danh mục phải là định dạng UUID hợp lệ" })
    }),
}