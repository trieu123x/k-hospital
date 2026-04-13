import axiosInstance from "@/utils/axios";

export const userApi = {
<<<<<<< HEAD
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
=======
  // lười sửa ở các file khác nên đổi link thôi hihi
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`auth/me`);
>>>>>>> 1622a7dc3c7f4e34d52ae81bf4018c6cd4d00182
    return response;
  },

  updateUser: async (userId, updateData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, updateData);
    return response;
  }
};