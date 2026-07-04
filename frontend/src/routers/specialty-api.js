import axiosInstance from '@/utils/axios'

export const getSpecialties = async (params = {}) => {
  return await axiosInstance.get('/specialties', { params })
}

export const getSpecialtiesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/specialties/admin', { params })
}

export const getSpecialtyById = async (id) => {
  return await axiosInstance.get(`/specialties/detail/${id}`)
}

export const createSpecialty = async (data) => {
  return await axiosInstance.post('/specialties', data)
}

export const updateSpecialty = async (id, data) => {
  return await axiosInstance.put(`/specialties/${id}`, data)
}

export const deleteSpecialty = async (id) => {
  return await axiosInstance.delete(`/specialties/${id}`)
}

export const restoreSpecialty = async (id) => {
  return await axiosInstance.put(`/specialties/${id}/restore`)
}
