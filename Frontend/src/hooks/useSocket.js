import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function useSocket(onAiResponse) {
  const socketRef = useRef(null)
  const callbackRef = useRef(onAiResponse)

  useEffect(() => { callbackRef.current = onAiResponse }, [onAiResponse])

  useEffect(() => {
    const socket = io('http://localhost:3000', { withCredentials: true })
    socketRef.current = socket

    socket.on('ai-response', (...args) => callbackRef.current(...args))

    return () => socket.disconnect()
  }, [])

  const sendMessage = (chatId, content) => {
    socketRef.current?.emit('ai-message', { chat: chatId, content })
  }

  return { sendMessage }
}
