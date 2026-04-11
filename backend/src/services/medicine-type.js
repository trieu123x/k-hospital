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
    }
}
