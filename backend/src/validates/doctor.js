import { z } from "zod";

export const doctorSchema = {
    getAll: {
        query: z.object({
            page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
            limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
            name: z.string().optional(),
            specialtyId: z.string().uuid().optional()
        })
    },

    getById: {
        params: z.object({
            id: z.string().uuid({ message: "ID bác sĩ không hợp lệ" })
        })
    },

    create: {
        body: z.object({
            email: z.string().email("Email không hợp lệ"),
            password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
            fullName: z.string().min(2, "Họ tên quá ngắn"),
            phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, "Số điện thoại không hợp lệ"),
            specialtyId: z.string().uuid("Chuyên khoa không hợp lệ").optional().nullable(),
            degreeId: z.string().uuid("Bằng cấp không hợp lệ").optional().nullable(),
            experience: z.string().optional().nullable(),
            education: z.string().optional().nullable(),
            achievements: z.string().optional().nullable()
        })
    },

    update: {
        params: z.object({
            id: z.string().uuid({ message: "ID bác sĩ không hợp lệ" })
        }),
        body: z.object({
            specialtyId: z.string().uuid("Chuyên khoa không hợp lệ").optional().nullable(),
            degreeId: z.string().uuid("Bằng cấp không hợp lệ").optional().nullable(),
            experience: z.string().optional().nullable(),
            education: z.string().optional().nullable(),
            achievements: z.string().optional().nullable(),
            // Profile fields that might be updated indirectly or via admin
            fullName: z.string().min(2).optional(),
            phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/).optional(),
            avatarUrl: z.string().url().optional().nullable(),
            dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
            address: z.string().optional().nullable()
        })
    }
};
