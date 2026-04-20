import axiosInstance from "@/utils/axios";

export const userApi = {
  // lười sửa ở các file khác nên đổi link thôi hihi
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`auth/me`);
    return response;
  },

  updateUser: async (userId, updateData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, updateData);
    return response;
  }
};