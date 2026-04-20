import axiosInstance from '@/utils/axios'

export const getUsersForAdmin = async (params = {}) => {
  return await axiosInstance.get('/users/admin', { params })
}

export const getTotalUsers = async () => {
  return await axiosInstance.get('/users/count')
}

export const getUserById = async (id) => {
  return await axiosInstance.get(`/users/${id}`)
}

export const toggleBlockUser = async (id, isActive) => {
  return await axiosInstance.patch(`/users/${id}/block`, { isActive })
}

export const deleteUser = async (id) => {
  return await axiosInstance.delete(`/users/${id}`)
}

export const createUser = async (data) => {
  return await axiosInstance.post('/users', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const createDoctorAccount = async (data) => {
  return await axiosInstance.post('/auth/register-doctor', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateUser = async (id, data) => {
  return await axiosInstance.put(`/users/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const logout = async () => {
  return await axiosInstance.post('/auth/logout')
}