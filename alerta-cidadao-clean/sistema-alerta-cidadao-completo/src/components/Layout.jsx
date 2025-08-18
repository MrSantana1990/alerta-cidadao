import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react'
import logo from '../assets/logo.png'

const Layout = ({ children, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(location.pathname.slice(1) || 'dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'campanhas', label: 'Campanhas', icon: MessageSquare, path: '/campanhas', badge: '3' },
    { id: 'contatos', label: 'Contatos', icon: Users, path: '/contatos', badge: '4' },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3, path: '/relatorios', badge: '5' }
  ]

  const handleTabClick = (item) => {
    setActiveTab(item.id)
    navigate(item.path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">Sistema Alerta Cidadão</h1>
              <p className="text-sm text-blue-700">Prefeitura de Campinas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Sistema Online
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-900 px-6 py-2">
        <div className="flex space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleTabClick(item)}
                className={`relative ${
                  isActive 
                    ? "bg-white text-blue-900 hover:bg-gray-100" 
                    : "text-white hover:bg-blue-800"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-orange-500 text-white text-xs px-1.5 py-0.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}

export default Layout

