import axiosInstance from '@/utils/axios'

export const getAllDegrees = async () => {
  return await axiosInstance.get('/degrees/all')
}

export const getDegreeById = async (id) => {
  return await axiosInstance.get(`/degrees/${id}`)
}
