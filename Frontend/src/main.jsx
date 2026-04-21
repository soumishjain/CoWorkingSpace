import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const savedTheme = localStorage.getItem("theme")


createRoot(document.getElementById('root')).render(
  <ThemeProvider>
  <BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
  </BrowserRouter>
  </ThemeProvider>
)
