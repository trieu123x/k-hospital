import axiosInstance from '@/utils/axios'

export const getAllMedicineTypes = async () => {
  return await axiosInstance.get('/medicine-types/all')
}

export const getMedicineTypeById = async (id) => {
  return await axiosInstance.get(`/medicine-types/${id}`)
}
