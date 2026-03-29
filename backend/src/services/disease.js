import { uploadHelper } from "../helpers/storage-helper.js"
import { diseaseRepository } from "../repositories/disease.js"
import { eventService } from "./event.js"
import axios from "axios"

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export const diseaseService = {
    createDisease: async (data, file) => {
        if (file) {
            const imageUrl = await uploadHelper.uploadFile(file, 'medicare', 'diseases')
            data.imageUrl = imageUrl
        }

        const newDisease = await diseaseRepository.create(data)
        try {
            if (data.symptoms) {
                const res = await axios.post(`${AI_SERVICE_URL}/ai/disease`, {
                    content: data.symptoms
                })

                const vector = res.data?.vector
                if (vector && Array.isArray(vector) && vector.length > 0) {
                    await diseaseRepository.updateEmbedding(newDisease.id, vector)
                }
            }
        } catch (error) {
            console.error("Lỗi tạo Embedding Vector:", error.message)
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
            try {
                const res = await axios.post(`${AI_SERVICE_URL}/ai/disease`, {
                    content: data.symptoms
                })

                const vector = res.data?.vector
                if (vector && Array.isArray(vector) && vector.length > 0) {
                    await diseaseRepository.updateEmbedding(id, vector)
                }
            } catch (error) {
                console.error("Lỗi Cập nhật Embedding Vector:", error.message)
            }
        }

        return updatedDisease
    },

    getDiseases: async (filters) => {
        const diseases = await diseaseRepository.findWithFilter(filters)

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