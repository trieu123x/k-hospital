import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications]
    })),

  markAsRead: (id) =>
    set(),

  removeNotification: (id) =>
    set(),

  clearAll: () => set({ notifications: [] }),
}));