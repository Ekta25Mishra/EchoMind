import { useState } from 'react'
import './styles/Sidebar.css'

export default function Sidebar({ chats, activeChatId, sidebarOpen, onNewChat, onLoadChat, onClose, onDeleteChat, onPinChat, onAccountOpen }) {
  const [hoveredId, setHoveredId] = useState(null)

  const pinned = chats.filter(c => c.pinned)
  const recent = chats.filter(c => !c.pinned)

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
        <button className="user-profile-btn" onClick={onAccountOpen}>
          <div className="avatar">👤</div>
          <span>My Account</span>
        </button>
      </div>
    </>
  )
}
