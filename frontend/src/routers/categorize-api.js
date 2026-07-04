import axiosInstance from '@/utils/axios'

export const getAllDiseaseCategories = async () => {
  return await axiosInstance.get('/disease-catgorize/all')
}

export const getDiseaseCategoryById = async (categorizeId) => {
  return await axiosInstance.get(`/disease-catgorize/${categorizeId}`)
}

export const getCategoriesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/disease-catgorize/admin', { params })
}

export const getCategoryDetail = async (id) => {
  return await axiosInstance.get(`/disease-catgorize/detail/${id}`)
}

export const createCategory = async (data) => {
  return await axiosInstance.post('/disease-catgorize', data)
}

export const updateCategory = async (id, data) => {
  return await axiosInstance.put(`/disease-catgorize/${id}`, data)
}

export const deleteCategory = async (id) => {
  return await axiosInstance.delete(`/disease-catgorize/${id}`)
}

export const restoreCategory = async (id) => {
  return await axiosInstance.put(`/disease-catgorize/${id}/restore`)
}