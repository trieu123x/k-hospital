import { uploadHelper } from "../helpers/storageHelper.js"
import { diseaseRepository } from "../repositories/disease.js"

export const diseaseService = {
    createDisease: async (data, file) => {
        if (file) {
            const imageUrl = await uploadHelper.uploadFile(file, 'medicare', 'diseases')
            data.imageUrl = imageUrl
        }

        const newDisease = await diseaseRepository.create(data)
        try {
            // Thêm logic/ gọi service biến đổi symtons thành embedding vector vào đây
            // const vector = []
            // await diseaseRepository.updateEmbedding(newDisease.id, vector)
        } catch (error) {
            console.error("Lỗi tạo Embedding Vector:", error)
        }

        return newDisease
    },

    updateDisease: async (id, data, file) => {
        if (file) {
            const existingDisease = await diseaseRepository.findById(id)
            
            if (existingDisease?.imageUrl) {
                await uploadHelper.deleteFile(existingDisease.imageUrl, 'medicare')
            }

            const newImageUrl = await uploadHelper.uploadFile(file, 'medicare', 'diseases')
            data.imageUrl = newImageUrl
        }

        const updatedDisease = await diseaseRepository.update(id, data)

        if (data.symptoms) {
            // Ở đây chứa logic cập nhật embedding vector nếu thay đổi symptoms ok
            // const vector = []
            // await diseaseRepository.updateEmbedding(newDisease.id, vector)
        }

        return updatedDisease
    },

    getDiseases: async (filters) => {
        return await diseaseRepository.findWithFilter(filters)
    },

    getDiseaseDetail: async (id) => {
        const disease = await diseaseRepository.findById(id)
        if (!disease) {
            throw new Error("Không tìm thấy thông tin bệnh!")
        }
        return disease
    },

    diagnoseBySymptoms: async (userSymptoms) => {
        if (!userSymptoms) {
            throw new Error("Vui lòng nhập triệu chứng!")
        }

        // Biến mô tả của người dùng thành Vector
        const inputVector = []

        return await diseaseRepository.findSimilarDiseases(inputVector, 5)
    },

    deleteDisease: async (id) => {
        const existing = await diseaseRepository.findById(id) 
        if (existing?.imageUrl) {
            await uploadHelper.deleteFile(existing.imageUrl, 'medicare')
        }

        return await diseaseRepository.delete(id)
    }
}