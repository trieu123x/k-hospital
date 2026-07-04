import axiosInstance from '@/utils/axios'

export const getAllDegrees = async () => {
  return await axiosInstance.get('/degrees/all')
}

export const getDegreeById = async (id) => {
  return await axiosInstance.get(`/degrees/${id}`)
}

export const getDegreesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/degrees/admin', { params })
}

export const getDegreeDetail = async (id) => {
  return await axiosInstance.get(`/degrees/detail/${id}`)
}

export const createDegree = async (data) => {
  return await axiosInstance.post('/degrees', data)
}

export const updateDegree = async (id, data) => {
  return await axiosInstance.put(`/degrees/${id}`, data)
}

export const deleteDegree = async (id) => {
  return await axiosInstance.delete(`/degrees/${id}`)
}

export const restoreDegree = async (id) => {
  return await axiosInstance.put(`/degrees/${id}/restore`)
}
