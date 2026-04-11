import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],

  setNotifications: (data) => set({ notifications: data }),

  addNotification: (notif) =>
    set((state) => {
      const isDuplicate = state.notifications.some((n) => n.id === notif.id)
      if (isDuplicate) {
        return state;
      }

      return {
        notifications: [notif, ...state.notifications]
      }
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  clearRead: () =>
    set((state) => ({
      notifications: state.notifications.filter((n) => !n.isRead)
    })),
}))