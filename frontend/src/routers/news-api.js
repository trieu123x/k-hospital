import axiosInstance from '@/utils/axios'

export const getNewsForAdmin = async (params = {}) => {
  return await axiosInstance.get('/news/admin', { params })
}

export const getNewsById = async (newsId) => {
  return await axiosInstance.get(`/news/${newsId}`)
}

export const createNews = async (data) => {
  return await axiosInstance.post('/news/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateNews = async (newsId, data) => {
  return await axiosInstance.put(`/news/update/${newsId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteNews = async (newsId) => {
  return await axiosInstance.delete(`/news/delete/${newsId}`)
}
