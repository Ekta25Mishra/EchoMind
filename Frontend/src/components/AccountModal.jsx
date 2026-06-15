import './styles/AccountModal.css'

export default function AccountModal({ user, onClose, onLogout }) {
  const fullName = user ? `${user.fullName.firstName} ${user.fullName.lastName}` : '—'
  const email = user?.email ?? '—'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">My Account</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="account-avatar">👤</div>

        <div className="account-details">
          <div className="account-row">
            <span className="account-label">Name</span>
            <span className="account-value">{fullName}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Email</span>
            <span className="account-value">{email}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
