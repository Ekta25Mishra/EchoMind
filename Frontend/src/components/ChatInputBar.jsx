import './styles/ChatInputBar.css'

export default function ChatInputBar({ input, onChange, onSubmit, loading }) {
  return (
    <form className="chat-input-bar" onSubmit={onSubmit}>
      <input
        className="chat-input"
        placeholder="Message EchoMind…"
        value={input}
        onChange={onChange}
        disabled={loading}
      />
      <button
        type="submit"
        className="send-btn"
        disabled={!input.trim() || loading}
        aria-label="Send"
      >
        ➤
      </button>
    </form>
  )
}
