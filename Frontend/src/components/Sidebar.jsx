import { useState } from 'react'
import { useTheme, COLOR_THEMES } from '../context/ThemeContext'
import './styles/Sidebar.css'

export default function Sidebar({ chats, activeChatId, sidebarOpen, onNewChat, onLoadChat, onClose, onDeleteChat, onPinChat, onAccountOpen }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [themeOpen, setThemeOpen] = useState(false)
  const { dark, toggle, colorTheme, changeColorTheme } = useTheme()

/*   const pinned = chats.filter(c => c.pinned)
  const recent = chats.filter(c => !c.pinned) */

  const safeChats = chats || []

const pinned = safeChats.filter(c => c.pinned)
const recent = safeChats.filter(c => !c.pinned)

  const ChatItem = ({ c }) => (
    <div
      className={`history-item-wrap${activeChatId === c.id ? ' active' : ''}`}
      onMouseEnter={() => setHoveredId(c.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <button className="history-item" onClick={() => onLoadChat(c.id)}>
        {c.pinned ? '📌' : '💬'} {c.title}
      </button>
      {hoveredId === c.id && (
        <div className="chat-actions">
          <button
            className="chat-action-btn"
            onClick={e => { e.stopPropagation(); onPinChat(c.id) }}
            aria-label={c.pinned ? 'Unpin chat' : 'Pin chat'}
            title={c.pinned ? 'Unpin' : 'Pin'}
          >
            {c.pinned ? '📍' : '📌'}
          </button>
          <button
            className="chat-action-btn chat-action-btn--delete"
            onClick={e => { e.stopPropagation(); onDeleteChat(c.id) }}
            aria-label="Delete chat"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="sidebar-header">
        <span className="brand">Echo<span>Mind</span></span>
        {sidebarOpen && (
          <button className="icon-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
        )}
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>+ New Chat</button>

      <nav className="chat-history">
        {pinned.length > 0 && (
          <>
            <p className="sidebar-label">Pinned</p>
            {pinned.map(c => <ChatItem key={c.id} c={c} />)}
          </>
        )}
        {recent.length > 0 && (
          <>
            <p className="sidebar-label">Recent</p>
            {recent.map(c => <ChatItem key={c.id} c={c} />)}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={() => setThemeOpen(o => !o)}>
          <span>🎨</span>
          <span>Theme</span>
          <span className="sidebar-footer-btn-arrow">{themeOpen ? '▾' : '▸'}</span>
        </button>

        {themeOpen && (
          <div className="theme-picker">
            <div className="theme-picker-row">
              <span className="theme-picker-label">Mode</span>
              <button className="theme-mode-btn" onClick={toggle}>
                {dark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            <div className="theme-picker-swatches">
              {COLOR_THEMES.map(t => (
                <button
                  key={t.id}
                  className={`theme-swatch${colorTheme === t.id ? ' theme-swatch--active' : ''}`}
                  onClick={() => changeColorTheme(t.id)}
                  title={t.label}
                >
                  <span className="theme-swatch-dot" style={t.id === 'default'
                    ? { background: 'var(--accent)' }
                    : { background: dark ? t.dark?.['--accent'] : t.light?.['--accent'] }
                  } />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="user-profile-btn" onClick={onAccountOpen}>
          <div className="avatar">👤</div>
          <span>My Account</span>
        </button>
      </div>
    </>
  )
}
