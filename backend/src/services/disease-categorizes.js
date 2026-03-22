import { diseaseCategoryRepository } from "../repositories/disease-categorizes.js"

export const diseaseCategoryService = {
    getAllCategories: async () => {
        const categories = await diseaseCategoryRepository.findAll()
        
        if (!categories) {
            throw Object.assign(new Error("Lấy danh mục bệnh thất bại"), { statusCode: 500 })
        }
        
        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description
        }))
    },

    getCategoryById: async (id) => {
        const category = await diseaseCategoryRepository.findById(id)
        
        if (!category) {
            throw Object.assign(new Error(`Danh mục bệnh ID ${id} không tồn tại`), { statusCode: 404 })
        }
        
        return {
            id: category.id,
            name: category.name,
            description: category.description
        }
    }
}