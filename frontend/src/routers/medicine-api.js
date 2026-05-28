import axiosInstance from '@/utils/axios'

export const getMedicinesForAdmin = async (params = {}) => {
  return await axiosInstance.get('/medicines/admin', { params })
}

export const getMedicineById = async (id) => {
  return await axiosInstance.get(`/medicines/${id}`)
}

export const createMedicine = async (data) => {
  return await axiosInstance.post('/medicines', data)
}

export const updateMedicine = async (id, data) => {
  return await axiosInstance.put(`/medicines/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteMedicine = async (id) => {
  return await axiosInstance.delete(`/medicines/${id}`)
}
