import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance, { clearToken } from '@/utils/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLogin: false,
      isAdmin: false,
      isDoctor: false,
      isLoading: true,

      setUser: (userData) => {
        if (userData) {
          const role = userData.role || '';
          set({
            user: userData,
            isLogin: true,
            isAdmin: role === 'ADMIN',
            isDoctor: role === 'DOCTOR',
            isLoading: false
          });
        } else {
          set({
            user: null,
            isLogin: false,
            isAdmin: false,
            isDoctor: false,
            isLoading: false
          });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          console.error("Logout API failed, ignoring...", error);
        } finally {
          clearToken();
          set({
            user: null,
            isLogin: false,
            isAdmin: false,
            isDoctor: false,
            isLoading: false
          });
          window.location.href = '/login';
        }
      },

      fetchUser: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (!token) {
          set({ isLoading: false, isLogin: false, user: null });
          return;
        }

        try {
          const res = await axiosInstance.get("/auth/me");
          if (res && res.data) {
            const role = res.data.role || '';
            console.log("ROLE: ", role)
            set({
              user: res.data,
              isLogin: true,
              isAdmin: role === 'ADMIN',
              isDoctor: role === 'DOCTOR',
              isLoading: false
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Fetch user error:", error);
          if (error.response?.status === 401) {
            get().logout();
          }
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin,
        isAdmin: state.isAdmin,
        isDoctor: state.isDoctor
      }),
    }
  )
);