import axiosInstance from '@/utils/axios'

export const getDiseases = async (params = {}) => {
  return await axiosInstance.get('/disease', { params })
}

export const getDiseasesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/disease/admin', { params })
}

export const getDiseaseById = async (diseaseId) => {
  return await axiosInstance.get(`/disease/${diseaseId}`)
}

export const createDisease = async (data) => {
  return await axiosInstance.post('/disease', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateDisease = async (diseaseId, data) => {
  return await axiosInstance.put(`/disease/${diseaseId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteDisease = async (diseaseId) => {
  return await axiosInstance.delete(`/disease/${diseaseId}`)
}

export const diagnoseSymptoms = async (data) => {
  return await axiosInstance.post('/disease/diagnose', data)
}
