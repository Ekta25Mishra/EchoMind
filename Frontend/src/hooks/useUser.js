import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setChats } from '../store/chatSlice'

const API = 'http://localhost:3000/api'

export default function useUser(onUnauthenticated) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(async res => {
        setUser(res.data.user)
        const { data } = await axios.get(`${API}/chat`, { withCredentials: true })
        dispatch(setChats(data.chats))
      })
      .catch(() => onUnauthenticated())
      .finally(() => setLoadingUser(false))
  }, [])

  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true }).catch(() => {})
    dispatch(setChats([]))
    onUnauthenticated()
  }

  return { user, loadingUser, logout }
}
