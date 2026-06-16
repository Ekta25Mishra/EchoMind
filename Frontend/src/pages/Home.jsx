import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import ChatHeader from '../components/ChatHeader'
import MessageList from '../components/MessageList'
import ChatInputBar from '../components/ChatInputBar'
import AccountModal from '../components/AccountModal'
import useUser from '../hooks/useUser'
import useSocket from '../hooks/useSocket'
import {
  addChat, removeChat, togglePin,
  setCurrentChat, setMessages, addMessage, editMessage, removeMessage, updateChatTitle,
} from '../store/chatSlice'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api'

export default function Home() {
  const navigate = useNavigate()
  const { user, loadingUser, logout } = useUser(() => navigate('/login'))
  const dispatch = useDispatch()
  const { chats, currentChat, messages } = useSelector(s => s.chat)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const newChat = () => {
    dispatch(setCurrentChat(null))
    setSidebarOpen(false)
  }

  const loadChat = async (id) => {
    const chat = chats.find(c => c.id === id)
    dispatch(setCurrentChat(chat))
    setSidebarOpen(false)
    try {
      const { data } = await axios.get(`${API}/chat/${id}/messages`, { withCredentials: true })
      dispatch(setMessages(data.messages))
    } catch {
      dispatch(setMessages([]))
    }
  }

  const deleteChat = async (id) => {
    await axios.delete(`${API}/chat/${id}`, { withCredentials: true }).catch(() => {})
    dispatch(removeChat(id))
  }

  const pinChat = (id) => {
    dispatch(togglePin(id))
  }

  const handleEditMessage = (msgId, newText) => {
    dispatch(editMessage({ id: msgId, text: newText }))
  }

  const handleDeleteMessage = async (msgId) => {
    if (!currentChat?.id) return
    await axios.delete(`${API}/chat/${currentChat.id}/message/${msgId}`, { withCredentials: true }).catch(() => {})
    dispatch(removeMessage(msgId))
  }

  const handleUpdateTitle = async (newTitle) => {
    if (!currentChat?.id || !newTitle.trim()) return
    const { data } = await axios.patch(`${API}/chat/${currentChat.id}`, { title: newTitle.trim() }, { withCredentials: true })
    dispatch(updateChatTitle({ id: currentChat.id, title: data.chat.title }))
  }

  const onAiResponse = useCallback(({ content }) => {
    dispatch(addMessage({ id: Date.now(), role: 'ai', text: content, timestamp: new Date().toISOString() }))
    setLoading(false)
  }, [])

  const { sendMessage: socketSend } = useSocket(onAiResponse)

  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setLoading(true)

    let chatId = currentChat?.id
    if (!chatId) {
      const { data } = await axios.post(`${API}/chat`, { title: text.slice(0, 40) }, { withCredentials: true })
      const newChatObj = { id: data.chat._id, title: data.chat.title, pinned: false }
      dispatch(addChat(newChatObj))
      dispatch(setCurrentChat(newChatObj))
      chatId = data.chat._id
    }

    dispatch(addMessage({ id: Date.now(), role: 'user', text, timestamp: new Date().toISOString() }))
    socketSend(chatId, text)
  }

  if (loadingUser) return null

  return (
    <div className="chat-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <Sidebar
          chats={chats}
          activeChatId={currentChat?.id ?? null}
          sidebarOpen={sidebarOpen}
          onNewChat={newChat}
          onLoadChat={loadChat}
          onClose={() => setSidebarOpen(false)}
          onDeleteChat={deleteChat}
          onPinChat={pinChat}
          onAccountOpen={() => setAccountOpen(true)}
        />
      </aside>

      <main className="chat-main">
        <ChatHeader
          title={currentChat?.title ?? 'New Chat'}
          onOpenSidebar={() => setSidebarOpen(true)}
          onUpdateTitle={currentChat ? handleUpdateTitle : null}
        />
        <MessageList messages={messages} loading={loading} onEditMessage={handleEditMessage} onDeleteMessage={handleDeleteMessage} />
        <ChatInputBar
          input={input}
          onChange={e => setInput(e.target.value)}
          onSubmit={sendMessage}
          loading={loading}
        />
      </main>

      {accountOpen && (
        <AccountModal user={user} onClose={() => setAccountOpen(false)} onLogout={() => logout()} />
      )}
    </div>
  )
}
