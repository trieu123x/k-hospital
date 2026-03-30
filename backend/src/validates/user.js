import { z } from "zod";

export const userSchema = {
    getAll: {
        query: z.object({
            page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
            limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10")
        })
    },

    getById: {
        params: z.object({
            id: z.string().uuid({ message: "ID người dùng không hợp lệ" })
        })
    },

    update: {
        params: z.object({
            id: z.uuid({ message: "ID người dùng không hợp lệ" })
        }),
        body: z.object({
            fullName: z.string().min(2, "Họ tên quá ngắn").optional(),
            phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, "Số điện thoại không hợp lệ").optional(),
            email: z.email({ error: "Email không hợp lệ" }).optional(),
            dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD").optional().nullable(),
            address: z.string().optional().nullable(),
            avatarUrl: z.string().url("Link ảnh không hợp lệ").optional().nullable()
        })
    },

    toggleBlock: {
        params: z.object({
            id: z.uuid({ message: "ID người dùng không hợp lệ" })
        }),
        body: z.object({
            isActive: z.boolean({ required_error: "Trạng thái isActive là bắt buộc" })
        })
    }
};
