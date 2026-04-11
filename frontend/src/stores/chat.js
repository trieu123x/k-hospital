import { create } from 'zustand'

export const useChatStore = create((set) => ({
  messages: [],
  isOpen: false,

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  clearMessages: () => set({ messages: [] }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setChatOpen: (isOpen) => set({ isOpen })
}))