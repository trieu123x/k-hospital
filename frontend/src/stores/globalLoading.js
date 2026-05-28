import { create } from 'zustand'

export const useGlobalLoading = create((set) => ({
  isLoading: false,
  message: '',
  showLoading: (message = '') => set({ isLoading: true, message }),
  hideLoading: () => set({ isLoading: false, message: '' })
}))
