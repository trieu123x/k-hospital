import { medicineRepository } from "../repositories/medicine.js"
import { uploadHelper } from "../helpers/storage-helper.js"
import axios from "axios"

export const medicineService = {
    getTotalCount: async () => {
        return await medicineRepository.countAll()
    },

    getMedicinesForAdmin: async (filters) => {
        const { page = 1, limit = 30 } = filters
        const { medicines, total } = await medicineRepository.findAllForAdmin(filters)
        return {
            medicines,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getAllMedicines: async (filters = {}, page = 1, limit = 10) => {
        const skip = (page - 1) * limit
        const { medicines, total } = await medicineRepository.findAll(filters, skip, limit)
        return {
            medicines,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getMedicineById: async (id) => {
        const medicine = await medicineRepository.findById(id)
        if (!medicine) {
            throw Object.assign(new Error("Không tìm thấy thuốc"), { statusCode: 404 })
        }
        return medicine
    },

    createMedicine: async (data, file) => {
        if (file) {
            const imageUrl = await uploadHelper.uploadFile(file, 'medicare', 'medicines')
            data.imageUrl = imageUrl
        }

        const newMedicine = await medicineRepository.create(data)
        try {
            const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'
            const res = await axios.post(`${AI_SERVICE_URL}/ai/disease/medicine`, {
                name: data.name,
                ingredients: data.ingredients || "",
                usage: data.usageInstruction || "",
                side_effects: data.sideEffects || ""
            })
            const chunks = res.data?.chunks
            if (chunks && Array.isArray(chunks) && chunks.length > 0) {
                await medicineRepository.createChunks(newMedicine.id, chunks)
            }
        } catch (error) {
            console.error("Lỗi tạo Embedding Chunks cho Thuốc:", error.message)
        }
        return newMedicine
    },

    updateMedicine: async (id, data, file) => {
        if (file) {
            const existingMedicine = await medicineRepository.findById(id)
            if (existingMedicine?.imageUrl) {
                await uploadHelper.deleteFile(existingMedicine.imageUrl, 'medicare')
            }
            const newImageUrl = await uploadHelper.uploadFile(file, 'medicare', 'medicines')
            data.imageUrl = newImageUrl
        }

        const updatedMedicine = await medicineRepository.update(id, data)
        try {
            const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'
            const res = await axios.post(`${AI_SERVICE_URL}/ai/disease/medicine`, {
                name: updatedMedicine.name,
                ingredients: updatedMedicine.ingredients || "",
                usage: updatedMedicine.usageInstruction || "",
                side_effects: updatedMedicine.sideEffects || ""
            })
            const chunks = res.data?.chunks
            if (chunks && Array.isArray(chunks) && chunks.length > 0) {
                await medicineRepository.createChunks(id, chunks)
            }
        } catch (error) {
            console.error("Lỗi Cập nhật Embedding Chunks cho Thuốc:", error.message)
        }
        return updatedMedicine
    },

    deleteMedicine: async (id) => {
        const existing = await medicineRepository.findById(id)
        if (existing?.imageUrl) {
            await uploadHelper.deleteFile(existing.imageUrl, 'medicare')
        }
        return await medicineRepository.delete(id)
    },

    restoreMedicine: async (id) => {
        const existing = await medicineRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Thuốc không tồn tại!"), { statusCode: 404 })
        }
        return await medicineRepository.restore(id)
    }
}