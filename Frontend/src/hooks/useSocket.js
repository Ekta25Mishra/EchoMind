import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function useSocket(onAiResponse) {
  const socketRef = useRef(null)
  const callbackRef = useRef(onAiResponse)

  useEffect(() => { callbackRef.current = onAiResponse }, [onAiResponse])

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true })
    socketRef.current = socket

    socket.on('ai-response', (...args) => callbackRef.current(...args))

    return () => socket.disconnect()
  }, [])

  const sendMessage = (chatId, content) => {
    socketRef.current?.emit('ai-message', { chat: chatId, content })
  }

  return { sendMessage }
}
