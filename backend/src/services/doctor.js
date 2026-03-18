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
    }
}
