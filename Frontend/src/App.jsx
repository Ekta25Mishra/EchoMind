import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}
