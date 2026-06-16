import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import './styles/ChatHeader.css'

export default function ChatHeader({ title, onOpenSidebar, onUpdateTitle }) {
  const { dark, toggle } = useTheme()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef(null)

  useEffect(() => { setDraft(title) }, [title])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const submit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== title) onUpdateTitle(trimmed)
    setEditing(false)
  }

  return (
    <header className="chat-header">
      <button className="icon-btn hamburger" onClick={onOpenSidebar} aria-label="Open sidebar">☰</button>

      {editing ? (
        <input
          ref={inputRef}
          className="chat-title-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={e => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') { setDraft(title); setEditing(false) }
          }}
        />
      ) : (
        <span
          className={`chat-title${onUpdateTitle ? ' chat-title--editable' : ''}`}
          onClick={() => onUpdateTitle && setEditing(true)}
          title={onUpdateTitle ? 'Click to rename' : undefined}
        >
          {title}
          {onUpdateTitle && <span className="chat-title-edit-icon">✏️</span>}
        </span>
      )}

      <button className="icon-btn theme-btn" onClick={toggle} aria-label="Toggle theme">
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
