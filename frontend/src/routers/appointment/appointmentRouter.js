import axiosInstance from "@/utils/axios";

const BASE_URL = "/appointments";

export const appointmentApi = {
  getAvailableSlots: async (params) => {
    const response = await axiosInstance.get(`${BASE_URL}/slots`, { params });
    return response;
  },

  getAllAppointments: async (params) => {
    const response = await axiosInstance.get(`${BASE_URL}/all`, { params });
    return response;
  },

  getAppointmentDetail: async (appointmentId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${appointmentId}`);
    return response;
  },

  bookAppointment: async (appointmentData) => {
    const response = await axiosInstance.post(`${BASE_URL}/book`, appointmentData);
    return response;
  },

  getPatientHistory: async (userId, params) => {
    const response = await axiosInstance.get(`${BASE_URL}/patient/${userId}`, { params });
    return response;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await axiosInstance.patch(`${BASE_URL}/cancel/${appointmentId}`);
    return response;
  },


  getDoctorSchedule: async (doctorId, params) => {
    const response = await axiosInstance.get(`${BASE_URL}/doctor/${doctorId}`, { params });
    return response;
  },


  updateAppointmentStatus: async (appointmentId, data) => {
    const response = await axiosInstance.patch(`${BASE_URL}/update/status/${appointmentId}`, data);
    return response;
  },

  registerDoctorLeave: async (leaveData) => {
    const response = await axiosInstance.post(`${BASE_URL}/leave`, leaveData);
    return response;
  },

  cancelDoctorLeave: async (leaveId) => {
    const response = await axiosInstance.delete(`${BASE_URL}/leave/${leaveId}`);
    return response;
  },
  getDoctorLeaves: async (doctorId, params) => {
    const response = await axiosInstance.get(`${BASE_URL}/leaves/${doctorId}`, { params });
    return response;
  },

  createMedicalRecord: async (appointmentId, recordData) => {
    const response = await axiosInstance.post(`${BASE_URL}/medical-record/create/${appointmentId}`, recordData);
    return response;
  },

  getMedicalRecordDetail: async (appointmentId) => {
    const response = await axiosInstance.get(`${BASE_URL}/medical-record/${appointmentId}`);
    return response;
  },

  updateMedicalRecord: async (appointmentId, recordData) => {
    const response = await axiosInstance.patch(`${BASE_URL}/medical-record/update/${appointmentId}`, recordData);
    return response;
  }
};