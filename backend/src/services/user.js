import { userRepository } from "../repositories/user.js"
import { uploadHelper } from "../helpers/storage-helper.js"

export const userService = {
    getTotalCount: async () => {
        return await userRepository.countAll()
    },

    getUsersForAdmin: async (filters) => {
        return await userRepository.findAllForAdmin(filters)
    },

    getAllUsers: async (requesterRole, page = 1, limit = 10) => {
        let filters = {}

        if (requesterRole === 'DOCTOR') {
            // Doctor can access all patients
            filters.role = 'PATIENT'
        } else if (requesterRole === 'ADMIN') {
            // Admin can access all profiles, no filter needed
        } else {
            // Others (patient or undefined) are not allowed
            throw Object.assign(new Error("Không có quyền truy cập danh sách người dùng"), { statusCode: 403 })
        }

        const skip = (page - 1) * limit
        const { users, total } = await userRepository.findAll(filters, skip, limit)
        
        return {
            users,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getUserById: async (id, requesterRole, requesterId) => {
        const user = await userRepository.findById(id)
        if (!user) {
            throw Object.assign(new Error("Không tìm thấy người dùng"), { statusCode: 404 })
        }

        // Logic check:
        // Admin: Can view anyone
        // Doctor: Can view doctors and patients (Prompt: "nếu là dortor thì cũng xem đc thông tin cụ thể của patient") -> basically anyone
        // Patient: Can view doctors, and themselves. Cannot view other patients.
        if (requesterRole === 'PATIENT') {
            if (user.role !== 'DOCTOR' && user.id !== requesterId) {
                throw Object.assign(new Error("Không có quyền xem thông tin người dùng này"), { statusCode: 403 })
            }
        }

        return user
    },

    updateUser: async (id, requesterId, updateData, file) => {
        // Only allow self-updating 
        if (id !== requesterId) {
            throw Object.assign(new Error("Chỉ có thể cập nhật thông tin của chính mình"), { statusCode: 403 })
        }

        // Filter out fields that shouldn't be updated here directly (like role, id, relational fields)
        const { role, id: profileId, createdAt, doctor, ...allowedData } = updateData;

        // Parse dob to Date if provided as string
        if (allowedData.dob) {
            allowedData.dob = new Date(allowedData.dob);
        }

        if (file) {
            const existingUser = await userRepository.findById(id);
            if (existingUser && existingUser.avatarUrl) {
                try {
                    await uploadHelper.deleteFile(existingUser.avatarUrl, 'medicare');
                } catch (e) {
                    console.error("Lỗi xóa ảnh cũ:", e);
                }
            }
            const imageUrl = await uploadHelper.uploadFile(file, 'medicare', 'users');
            allowedData.avatarUrl = imageUrl;
        }

        const updatedUser = await userRepository.update(id, allowedData)
        return updatedUser
    },

    toggleBlockUser: async (id, isActive) => {
        const user = await userRepository.findById(id)
        if (!user) {
            throw Object.assign(new Error("Không tìm thấy người dùng"), { statusCode: 404 })
        }
        
        return await userRepository.update(id, { isActive: !!isActive })
    },

    deleteUser: async (id) => {
        const user = await userRepository.findById(id)
        if (!user) {
            throw Object.assign(new Error("Không tìm thấy người dùng"), { statusCode: 404 })
        }

        // Try deleting from Supabase if configured (optional advanced feature)
        // Dynamically resolving to avoid changing file structure unnecessarily
        try {
            const { supabaseAdmin } = await import("../configs/supabase-config.js")
            if (supabaseAdmin) {
                await supabaseAdmin.auth.admin.deleteUser(id)
            }
        } catch (err) {
            console.error("Supabase Admin user deletion failed or not configured:", err.message)
            // Proceed with prisma deletion anyway
        }

        // Cascade will delete related DB entities (doctor, appointments, etc.)
        return await userRepository.delete(id)
    }
}
