import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api/auth'

export default function useUser(onUnauthenticated) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    axios.get(`${API}/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => onUnauthenticated())
      .finally(() => setLoadingUser(false))
  }, [])

  const logout = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true }).catch(() => {})
    onUnauthenticated()
  }

  return { user, loadingUser, logout }
}
