import { uploadHelper } from "../helpers/storage-helper.js"
import { diseaseRepository } from "../repositories/disease.js"
import { eventService } from "./event.js"

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

    getDiseases: async (filters, userId = null) => {
        const diseases = await diseaseRepository.findWithFilter(filters)

        if (filters.name) {
            eventService.track(userId, 'SEARCH_DISEASE', null, { keyword: filters.name })
        }

        return diseases
    },

    getDiseaseDetail: async (id, userId = null) => {
        const disease = await diseaseRepository.findById(id)
        if (!disease) {
            throw Object.assign(new Error("Không tìm thấy thông tin bệnh!"), { statusCode: 404 })
        }

        eventService.track(userId, 'VIEW_DISEASE', id)

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