import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications]
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  clearAll: () => set({ notifications: [] }),
}));