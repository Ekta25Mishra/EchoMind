import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Home() {
  const { dark, toggle } = useTheme()

  return (
    <div className="page">
      <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="hero">
        <h1>Echo<span>Mind</span></h1>
        <p>Capture your thoughts, reflect on your journey, and grow with every word you write.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-outline">Login</Link>
        </div>
      </div>
    </div>
  )
}
