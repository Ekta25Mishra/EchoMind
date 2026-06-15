import { useTheme } from '../context/ThemeContext'
import './styles/ChatHeader.css'

export default function ChatHeader({ title, onOpenSidebar }) {
  const { dark, toggle } = useTheme()

  return (
    <header className="chat-header">
      <button className="icon-btn hamburger" onClick={onOpenSidebar} aria-label="Open sidebar">☰</button>
      <span className="chat-title">{title}</span>
      <button className="icon-btn theme-btn" onClick={toggle} aria-label="Toggle theme">
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
