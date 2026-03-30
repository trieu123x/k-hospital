import { z } from "zod";

export const medicineSchema = {
    getAll: {
        query: z.object({
            page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
            limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
            name: z.string().optional(),
            medicineType: z.string().optional()
        })
    },

    getById: {
        params: z.object({
            id: z.string().uuid({ message: "ID thuốc không hợp lệ" })
        })
    },

    create: {
        body: z.object({
            name: z.string().min(2, "Tên thuốc quá ngắn"),
            imageUrl: z.string().url().optional().nullable(),
            medicineType: z.string().optional().nullable(),
            ingredients: z.string().optional().nullable(),
            dosage: z.string().optional().nullable(),
            usageInstruction: z.string().optional().nullable(),
            sideEffects: z.string().optional().nullable()
        })
    },

    update: {
        params: z.object({
            id: z.string().uuid({ message: "ID thuốc không hợp lệ" })
        }),
        body: z.object({
            name: z.string().min(2).optional(),
            imageUrl: z.string().url().optional().nullable(),
            medicineType: z.string().optional().nullable(),
            ingredients: z.string().optional().nullable(),
            dosage: z.string().optional().nullable(),
            usageInstruction: z.string().optional().nullable(),
            sideEffects: z.string().optional().nullable()
        })
    }
};
