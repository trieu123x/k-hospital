import axiosInstance from "@/utils/axios";

export const userApi = {
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response;
  },

  updateUser: async (userId, updateData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, updateData);
    return response;
  }
};