import { userRepository } from "../repositories/user.js"

export const userService = {
    getAllUsers: async (requesterRole, page = 1, limit = 10) => {
        let filters = {}

        if (requesterRole === 'doctor') {
            // Doctor can access all patients
            filters.role = 'patient'
        } else if (requesterRole === 'admin') {
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
        if (requesterRole === 'patient') {
            if (user.role !== 'doctor' && user.id !== requesterId) {
                throw Object.assign(new Error("Không có quyền xem thông tin người dùng này"), { statusCode: 403 })
            }
        }

        return user
    },

    updateUser: async (id, requesterId, updateData) => {
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

        const updatedUser = await userRepository.update(id, allowedData)
        return updatedUser
    }
}
