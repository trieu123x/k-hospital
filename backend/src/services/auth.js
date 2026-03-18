import { supabase } from "../configs/supabase-config.js"
import { profileRepository } from "../repositories/auth.js"

export const authService = {
    /**
     * Đăng ký tài khoản mới
     * - Tạo user trên Supabase Auth
     * - Tạo profile trong bảng profiles (Prisma)
     */
    register: async ({ email, password, fullName, phone }) => {
        // 1. Kiểm tra phone đã tồn tại chưa
        const existingProfile = await profileRepository.findByPhone(phone)
        if (existingProfile) {
            throw Object.assign(new Error("Số điện thoại đã được sử dụng"), { statusCode: 409 })
        }

        // 2. Tạo user trên Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, phone }
            }
        })

        if (authError) {
            throw Object.assign(new Error(authError.message), { statusCode: 400 })
        }

        const userId = authData.user?.id
        if (!userId) {
            throw Object.assign(new Error("Không thể tạo tài khoản"), { statusCode: 500 })
        }

        // 3. Tạo profile trong DB
        const profile = await profileRepository.create({
            id: userId,
            fullName,
            phone,
            role: "patient"
        })

        return {
            userId: profile.id,
            fullName: profile.fullName,
            phone: profile.phone,
            role: profile.role,
            email: authData.user.email,
        }
    },

    /**
     * Đăng nhập
     * - Xác thực qua Supabase Auth (email/password)
     * - Trả về session token + thông tin profile
     */
    login: async ({ email, password }) => {
        // 1. Xác thực với Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            throw Object.assign(new Error("Email hoặc mật khẩu không đúng"), { statusCode: 401 })
        }

        const userId = authData.user?.id
        if (!userId) {
            throw Object.assign(new Error("Đăng nhập thất bại"), { statusCode: 500 })
        }

        // 2. Lấy thông tin profile từ DB
        const profile = await profileRepository.findById(userId)
        if (!profile) {
            throw Object.assign(new Error("Tài khoản không tồn tại trong hệ thống"), { statusCode: 404 })
        }

        return {
            accessToken: authData.session.access_token,
            refreshToken: authData.session.refresh_token,
            user: {
                userId: profile.id,
                fullName: profile.fullName,
                phone: profile.phone,
                role: profile.role,
                avatarUrl: profile.avatarUrl,
                email: authData.user.email,
            }
        }
    },

    /**
     * Đăng xuất - vô hiệu hóa session hiện tại trên Supabase
     */
    logout: async (accessToken) => {
        // Gán token vào session rồi sign out
        const { error } = await supabase.auth.admin.signOut(accessToken)
        if (error) {
            throw Object.assign(new Error("Đăng xuất thất bại"), { statusCode: 500 })
        }
        return true
    },

    /**
     * Lấy thông tin user hiện tại từ token
     */
    getMe: async (userId) => {
        const profile = await profileRepository.findById(userId)
        if (!profile) {
            throw Object.assign(new Error("Không tìm thấy người dùng"), { statusCode: 404 })
        }
        return profile
    }
}
