import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Componentes
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Campanhas from './components/Campanhas'
import Contatos from './components/Contatos'
import Relatorios from './components/Relatorios'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (email, password) => {
    // Simulação de login - aceita qualquer email/senha para demonstração
    if (email && password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
