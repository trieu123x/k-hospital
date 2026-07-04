import { medicineTypeRepository } from "../repositories/medicine-type.js"

export const medicineTypeService = {
    getAllMedicineTypes: async () => {
        const types = await medicineTypeRepository.findAll()

        if (!types) {
            throw Object.assign(new Error("Lấy danh sách loại thuốc thất bại"), { statusCode: 500 })
        }

        return types.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description
        }))
    },

    getMedicineTypeById: async (id) => {
        const type = await medicineTypeRepository.findById(id)

        if (!type) {
            throw Object.assign(new Error(`Loại thuốc ID ${id} không tồn tại`), { statusCode: 404 })
        }

        return {
            id: type.id,
            name: type.name,
            description: type.description
        }
    },

    createMedicineType: async (data) => {
        if (!data.name) {
            throw Object.assign(new Error("Tên loại thuốc không được để trống!"), { statusCode: 400 })
        }
        return await medicineTypeRepository.create(data)
    },

    updateMedicineType: async (id, data) => {
        const existing = await medicineTypeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Loại thuốc không tồn tại!"), { statusCode: 404 })
        }
        return await medicineTypeRepository.update(id, data)
    },

    deleteMedicineType: async (id) => {
        const existing = await medicineTypeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Loại thuốc không tồn tại!"), { statusCode: 404 })
        }
        return await medicineTypeRepository.delete(id)
    },

    restoreMedicineType: async (id) => {
        const existing = await medicineTypeRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Loại thuốc không tồn tại!"), { statusCode: 404 })
        }
        return await medicineTypeRepository.restore(id)
    },

    getAllMedicineTypesForAdmin: async ({ name, page = 1, limit = 30, deleted = false }) => {
        const { items, total } = await medicineTypeRepository.findAllForAdmin({ name, page, limit, deleted })
        return {
            items,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
}
