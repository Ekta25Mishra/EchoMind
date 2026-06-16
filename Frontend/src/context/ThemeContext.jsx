import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const COLOR_THEMES = [
  { id: 'default', label: 'Default', light: null, dark: null },
  {
    id: 'ocean', label: 'Ocean', 
    light: { '--accent': '#0077b6', '--accent-hover': '#0096c7', '--bg': '#eaf4fb', '--surface': '#ffffff', '--surface-alt': '#cce8f4' },
    dark:  { '--accent': '#48cae4', '--accent-hover': '#90e0ef', '--bg': '#03045e', '--surface': '#023e8a', '--surface-alt': '#0077b6' }
  },
  {
    id: 'forest', label: 'Forest',
    light: { '--accent': '#2d6a4f', '--accent-hover': '#40916c', '--bg': '#edf7f0', '--surface': '#ffffff', '--surface-alt': '#d8f3dc' },
    dark:  { '--accent': '#74c69d', '--accent-hover': '#95d5b2', '--bg': '#081c15', '--surface': '#1b4332', '--surface-alt': '#2d6a4f' }
  },
  {
    id: 'sunset', label: 'Sunset',
    light: { '--accent': '#d62828', '--accent-hover': '#e63946', '--bg': '#fff5f5', '--surface': '#ffffff', '--surface-alt': '#fce4e4' },
    dark:  { '--accent': '#f4a261', '--accent-hover': '#e76f51', '--bg': '#1a0a00', '--surface': '#2d1b00', '--surface-alt': '#4a2c00' }
  },
  {
    id: 'violet', label: 'Violet',
    light: { '--accent': '#7209b7', '--accent-hover': '#9b2cca', '--bg': '#f8f0ff', '--surface': '#ffffff', '--surface-alt': '#ead5f9' },
    dark:  { '--accent': '#c77dff', '--accent-hover': '#e0aaff', '--bg': '#10002b', '--surface': '#240046', '--surface-alt': '#3c096c' }
  },
]

function applyColorTheme(themeId, isDark) {
  const theme = COLOR_THEMES.find(t => t.id === themeId)
  const vars = theme?.id !== 'default' ? (isDark ? theme.dark : theme.light) : null
  const root = document.documentElement

  // Reset all accent/bg vars first
  COLOR_THEMES.slice(1).forEach(t => {
    const src = isDark ? t.dark : t.light
    if (src) Object.keys(src).forEach(k => root.style.removeProperty(k))
  })

  if (vars) Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('colorTheme') || 'default')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    applyColorTheme(colorTheme, dark)
  }, [dark, colorTheme])

  const changeColorTheme = (id) => {
    setColorTheme(id)
    localStorage.setItem('colorTheme', id)
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), colorTheme, changeColorTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
