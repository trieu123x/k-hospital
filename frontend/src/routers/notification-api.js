import axiosInstance from '@/utils/axios'

export const getNotifications = async (userId, lastId = null) => {
  const params = { userId }
  if (lastId) params.lastId = lastId
  return await axiosInstance.get('/user-notification', { params })
}

export const markNotificationAsRead = async (notificationId) => {
  return await axiosInstance.patch(`/user-notification/${notificationId}/read`)
}

export const deleteNotificationApi = async (notificationId) => {
  return await axiosInstance.delete(`/user-notification/${notificationId}`)
}

export const clearReadNotificationsApi = async (userId) => {
  return await axiosInstance.delete('/user-notification/clean/read', {
    params: { userId }
  })
}