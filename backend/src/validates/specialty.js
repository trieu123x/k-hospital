import { z } from "zod";

export const specialtySchema = {
    getDoctors: {
        params: z.object({
            id: z.string().uuid({ message: "ID chuyên khoa không hợp lệ" })
        }),
        query: z.object({
            page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
            limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10")
        })
    }
};
