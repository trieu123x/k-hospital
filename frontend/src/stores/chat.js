import { create } from 'zustand'

export const useChatStore = create((set) => ({
  session: null,
  chatSessions: [],

  resetSession: () => set({
    session: null,
    chatSessions: []
  }),

  setSession: (session, chatSessions) => set({
    session: session,
    chatSessions: chatSessions
  }),

  addChatSession: (newChatSession) => set((state) => ({
    chatSessions: [newChatSession, ...state.chatSessions]
  }))
}))