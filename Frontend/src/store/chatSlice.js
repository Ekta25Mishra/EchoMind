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
      state.chats = payload
    },
    addChat(state, { payload }) {
      state.chats.unshift(payload)
    },
    removeChat(state, { payload: id }) {
      state.chats = state.chats.filter(c => c.id !== id)
      if (state.currentChat?.id === id) {
        state.currentChat = null
        state.messages = []
      }
    },
    togglePin(state, { payload: id }) {
      const chat = state.chats.find(c => c.id === id)
      if (chat) chat.pinned = !chat.pinned
    },
    setCurrentChat(state, { payload }) {
      state.currentChat = payload   // pass full chat object or null
      state.messages = []
    },
    setMessages(state, { payload }) {
      state.messages = payload
    },
    addMessage(state, { payload }) {
      state.messages.push(payload)
    },
    editMessage(state, { payload: { id, text } }) {
      const msg = state.messages.find(m => m.id === id)
      if (msg) msg.text = text
    },
    removeMessage(state, { payload: id }) {
      state.messages = state.messages.filter(m => m.id !== id)
    },
    updateChatTitle(state, { payload: { id, title } }) {
      const chat = state.chats.find(c => c.id === id)
      if (chat) chat.title = title
      if (state.currentChat?.id === id) state.currentChat.title = title
    },
  },
})

export const {
  setChats, addChat, removeChat, togglePin,
  setCurrentChat, setMessages, addMessage, editMessage, removeMessage, updateChatTitle,
} = chatSlice.actions

export default chatSlice.reducer
