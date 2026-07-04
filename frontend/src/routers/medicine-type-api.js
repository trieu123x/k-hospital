import axiosInstance from '@/utils/axios'

export const getAllMedicineTypes = async () => {
  return await axiosInstance.get('/medicine-types/all')
}

export const getMedicineTypeById = async (id) => {
  return await axiosInstance.get(`/medicine-types/${id}`)
}

export const getMedicineTypesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/medicine-types/admin', { params })
}

export const getMedicineTypeDetail = async (id) => {
  return await axiosInstance.get(`/medicine-types/detail/${id}`)
}

export const createMedicineType = async (data) => {
  return await axiosInstance.post('/medicine-types', data)
}

export const updateMedicineType = async (id, data) => {
  return await axiosInstance.put(`/medicine-types/${id}`, data)
}

export const deleteMedicineType = async (id) => {
  return await axiosInstance.delete(`/medicine-types/${id}`)
}

export const restoreMedicineType = async (id) => {
  return await axiosInstance.put(`/medicine-types/${id}/restore`)
}
