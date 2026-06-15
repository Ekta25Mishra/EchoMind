import { useRef, useEffect, useState } from 'react'
import './styles/MessageList.css'

const BOT_AVATAR = '🤖'
const USER_AVATAR = '🧑'

function toDate(ts) {
  return new Date(ts)  // handles both Date.now() number and ISO string from DB
}

function formatTime(ts) {
  return toDate(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(ts) {
  const d = toDate(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function groupByDate(messages) {
  const groups = []
  let lastLabel = null
  for (const msg of messages) {
    const label = formatDateLabel(msg.timestamp)
    if (label !== lastLabel) {
      groups.push({ type: 'date', label, key: `date-${msg.timestamp}` })
      lastLabel = label
    }
    groups.push({ type: 'msg', msg })
  }
  return groups
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button className="msg-action-btn" onClick={handleCopy} title="Copy" aria-label="Copy message">
      {copied ? '✅' : '📋'}
    </button>
  )
}

function MessageItem({ msg, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(msg.text)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus()
      const len = textareaRef.current?.value.length
      textareaRef.current?.setSelectionRange(len, len)
    }
  }, [editing])

  const submitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== msg.text) onEdit(msg.id, trimmed)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(msg.text)
    setEditing(false)
  }

  const isUser = msg.role === 'user'

  return (
    <div className={`msg-row msg-row--${msg.role}`}>
      <span className="msg-avatar">{isUser ? USER_AVATAR : BOT_AVATAR}</span>

      <div className="msg-block">
        {editing ? (
          <div className="msg-edit-wrap">
            <textarea
              ref={textareaRef}
              className="msg-edit-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit() }
                if (e.key === 'Escape') cancelEdit()
              }}
              rows={3}
            />
            <div className="msg-edit-actions">
              <button className="msg-edit-save" onClick={submitEdit}>Save</button>
              <button className="msg-edit-cancel" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="msg-bubble">{msg.text}</div>
        )}

        <div className={`msg-meta msg-meta--${msg.role}`}>
          <span className="msg-time">{formatTime(msg.timestamp)}</span>
          {!editing && (
            <div className="msg-actions">
              <CopyButton text={msg.text} />
              {isUser && (
                <button
                  className="msg-action-btn"
                  onClick={() => { setDraft(msg.text); setEditing(true) }}
                  title="Edit"
                  aria-label="Edit message"
                >
                  ✏️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessageList({ messages, loading, onEditMessage }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const grouped = groupByDate(messages)

  return (
    <div className="messages">
      {messages.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">✨</p>
          <p className="empty-title">Start a conversation</p>
          <p className="empty-sub">Ask EchoMind anything…</p>
        </div>
      )}

      {grouped.map(item =>
        item.type === 'date' ? (
          <div key={item.key} className="date-divider">
            <span>{item.label}</span>
          </div>
        ) : (
          <MessageItem
            key={item.msg.id}
            msg={item.msg}
            onEdit={onEditMessage}
          />
        )
      )}

      {loading && (
        <div className="msg-row msg-row--ai">
          <span className="msg-avatar">{BOT_AVATAR}</span>
          <div className="msg-block">
            <div className="msg-bubble typing"><span /><span /><span /></div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
