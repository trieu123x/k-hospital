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
  })),

  updateLastAIMessage: (newTextChunk) => set((state) => {
    const currentList = [...state.chatSessions]
    if (currentList.length > 0 && currentList[0].role === 'AI') {
      currentList[0].message += newTextChunk;
    }
    return { chatSessions: currentList };
  })
}))