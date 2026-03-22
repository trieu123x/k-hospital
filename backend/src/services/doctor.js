import { doctorRepository } from "../repositories/doctor.js"

export const doctorService = {
    getAllDoctors: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit
        // Anyone can see all doctors, no role filter needed for visibility
        const { doctors, total } = await doctorRepository.findAllDoctors({}, skip, limit)
        
        return {
            doctors,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getDoctorById: async (id) => {
        const doctor = await doctorRepository.findDoctorById(id)
        if (!doctor) {
            throw Object.assign(new Error("Không tìm thấy thông tin bác sĩ"), { statusCode: 404 })
        }
        return doctor
    },

    updateDoctorInfo: async (doctorId, requesterId, updateData) => {
        // Only allow self-updating
        if (doctorId !== requesterId) {
            throw Object.assign(new Error("Chỉ có thể cập nhật thông tin của chính mình"), { statusCode: 403 })
        }

        // Filter out fields that shouldn't be updated here directly
        const { id, profile, specialty, ...allowedData } = updateData;

        // Ensure doctor record exists
        const existingDoctor = await doctorRepository.findDoctorById(doctorId)
        if (!existingDoctor) {
            // First time updating extra info? We create it if it doesn't exist.
            // But Prisma schema indicates `doctor` is implicitly created if role is doctor?
            // Wait, register auth doesn't create doctor record currently, it only creates Profile.
            throw Object.assign(new Error("Không tìm thấy hồ sơ bác sĩ (Cần được admin cấp phép trước)"), { statusCode: 404 })
        }

        const updatedDoctor = await doctorRepository.updateDoctorInfo(doctorId, allowedData)
        return updatedDoctor
    },

    createDoctor: async (data) => {
        const { email, password, fullName, phone, specialtyId, degree, experience, education, achievements } = data;
        
        let userId;

        // 1. Create Supabase Auth User if not existing
        if (email && password) {
            const { supabaseAdmin } = await import("../configs/supabase-config.js")
            if (!supabaseAdmin) {
                throw Object.assign(new Error("Cần cấu hình SUPABASE_SERVICE_ROLE_KEY để tạo tài khoản."), { statusCode: 500 })
            }
            
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: fullName, phone }
            })
            
            if (authError) {
                throw Object.assign(new Error(authError.message), { statusCode: 400 })
            }
            userId = authData.user.id;
        } else {
            throw Object.assign(new Error("Yêu cầu email và password để tạo tài khoản bác sĩ."), { statusCode: 400 })
        }

        const { prisma } = await import("../configs/prisma-config.js")
        
        // 2. Transact Profile creation and Doctor creation
        const newDoctor = await prisma.$transaction(async (tx) => {
            await tx.profile.create({
                data: {
                    id: userId,
                    fullName,
                    phone: phone || "",
                    role: "doctor"
                }
            })
            
            return await tx.doctor.create({
                data: {
                    id: userId,
                    specialtyId,
                    degree,
                    experience,
                    education,
                    achievements
                },
                include: {
                    profile: true,
                    specialty: true
                }
            })
        })

        return newDoctor;
    },

    updateDoctorByAdmin: async (doctorId, updateData) => {
        // Full access without self check
        const { id, profile, specialty, ...allowedData } = updateData;

        // Attempt to find or bypass (since Prisma throws if not found sometimes, but let repository handle it)
        const updatedDoctor = await doctorRepository.updateDoctorInfo(doctorId, allowedData)
        return updatedDoctor
    }
}
