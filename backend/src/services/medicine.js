import { medicineRepository } from "../repositories/medicine.js"

export const medicineService = {
    getTotalCount: async () => {
        return await medicineRepository.countAll()
    },

    getMedicinesForAdmin: async (filters) => {
        return await medicineRepository.findAllForAdmin(filters)
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

    createMedicine: async (data) => {
        return await medicineRepository.create(data)
    },

    updateMedicine: async (id, data) => {
        return await medicineRepository.update(id, data)
    },

    deleteMedicine: async (id) => {
        return await medicineRepository.delete(id)
    }
}