import axiosInstance from '@/utils/axios'

export const getSpecialties = async (params = {}) => {
  return await axiosInstance.get('/specialties', { params })
}
