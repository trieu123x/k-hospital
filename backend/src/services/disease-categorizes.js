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
    },

    createCategory: async (data) => {
        if (!data.name) {
            throw Object.assign(new Error("Tên danh mục bệnh không được để trống!"), { statusCode: 400 })
        }
        return await diseaseCategoryRepository.create(data)
    },

    updateCategory: async (id, data) => {
        const existing = await diseaseCategoryRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Danh mục bệnh không tồn tại!"), { statusCode: 404 })
        }
        return await diseaseCategoryRepository.update(id, data)
    },

    deleteCategory: async (id) => {
        const existing = await diseaseCategoryRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Danh mục bệnh không tồn tại!"), { statusCode: 404 })
        }
        return await diseaseCategoryRepository.delete(id)
    },

    restoreCategory: async (id) => {
        const existing = await diseaseCategoryRepository.findById(id)
        if (!existing) {
            throw Object.assign(new Error("Danh mục bệnh không tồn tại!"), { statusCode: 404 })
        }
        return await diseaseCategoryRepository.restore(id)
    },

    getAllCategoriesForAdmin: async ({ name, page = 1, limit = 30, deleted = false }) => {
        const { items, total } = await diseaseCategoryRepository.findAllForAdmin({ name, page, limit, deleted })
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