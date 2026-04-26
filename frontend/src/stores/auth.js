import { create } from 'zustand'
import axiosInstance from '@/utils/axios'

export const useAuthStore = create((set) => ({
  user: null,
  isLogin: false,
  isAdmin: false,
  isDoctor: false,
  isLoading: true, // initial state before check

  setUser: (userData) => {
    if (userData) {
      const role = userData.role?.toLowerCase() || '';
      set({
        user: userData,
        isLogin: true,
        isAdmin: role === 'admin',
        isDoctor: role === 'doctor',
        isLoading: false
      })
    } else {
      set({
        user: null,
        isLogin: false,
        isAdmin: false,
        isDoctor: false,
        isLoading: false
      })
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    set({
      user: null,
      isLogin: false,
      isAdmin: false,
      isDoctor: false
    })
  },

  fetchUser: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      if (res.data) {
        const role = res.data.role?.toLowerCase() || '';
        set({
          user: res.data,
          isLogin: true,
          isAdmin: role === 'admin',
          isDoctor: role === 'doctor',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        user: null,
        isLogin: false,
        isAdmin: false,
        isDoctor: false,
        isLoading: false
      })
    }
  }
}))