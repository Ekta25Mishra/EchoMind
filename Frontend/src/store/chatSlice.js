import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,   // { id, title, pinned }
    messages: [],
  },
  reducers: {
    setChats(state, { payload }) {
      state.chats = Array.isArray(payload) ? payload : []
    },
    addChat(state, { payload }) {
      if (payload) state.chats.unshift(payload)
    },
    removeChat(state, { payload: id }) {
      if (!id) return
      state.chats = state.chats.filter(c => c.id !== id)
      if (state.currentChat?.id === id) {
        state.currentChat = null
        state.messages = []
      }
    },
    togglePin(state, { payload: id }) {
      if (!id) return
      const chat = state.chats.find(c => c.id === id)
      if (chat) chat.pinned = !chat.pinned
    },
    setCurrentChat(state, { payload }) {
      state.currentChat = payload ?? null
      state.messages = []
    },
    setMessages(state, { payload }) {
      state.messages = Array.isArray(payload) ? payload : []
    },
    addMessage(state, { payload }) {
      if (payload) state.messages.push(payload)
    },
    editMessage(state, { payload }) {
      if (!payload?.id) return
      const msg = state.messages.find(m => m.id === payload.id)
      if (msg) msg.text = payload.text
    },
    removeMessage(state, { payload: id }) {
      if (!id) return
      state.messages = state.messages.filter(m => m.id !== id)
    },
    updateChatTitle(state, { payload }) {
      if (!payload?.id || !payload?.title) return
      const chat = state.chats.find(c => c.id === payload.id)
      if (chat) chat.title = payload.title
      if (state.currentChat?.id === payload.id) state.currentChat.title = payload.title
    },
  },
})

export const {
  setChats, addChat, removeChat, togglePin,
  setCurrentChat, setMessages, addMessage, editMessage, removeMessage, updateChatTitle,
} = chatSlice.actions

export default chatSlice.reducer
