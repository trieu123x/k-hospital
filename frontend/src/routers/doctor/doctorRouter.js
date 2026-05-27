import axiosInstance from "@/utils/axios";

export const doctorApi = {

  getDoctorById: async (doctorId) => {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response;
  },

  updateDoctorInfo: async (doctorId, updateData) => {
    const response = await axiosInstance.patch(`/doctors/${doctorId}`, updateData);
    return response;
  },

  updateDoctorByAdmin: async (doctorId, data) => {
    const response = await axiosInstance.put(`/doctors/${doctorId}`, data);
    return response;
  }
};