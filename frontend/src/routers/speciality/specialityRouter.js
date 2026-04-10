import axiosInstance from "@/utils/axios";
const BASE_URL = "/specialties";

export const specialtyApi = {
  getAllSpecialties: async () => {
    const response = await axiosInstance.get(`${BASE_URL}`);
    return response;
  },

  getDoctorsBySpecialty: async (id, params) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`, { params });
    return response;
  }
};