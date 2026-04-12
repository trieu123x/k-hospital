import axiosInstance from '@/utils/axios'

export const getAllDiseaseCategories = async () => {
  return await axiosInstance.get('/disease-catgorize/all')
}

export const getDiseaseCategoryById = async (categorizeId) => {
  return await axiosInstance.get(`/disease-catgorize/${categorizeId}`)
}