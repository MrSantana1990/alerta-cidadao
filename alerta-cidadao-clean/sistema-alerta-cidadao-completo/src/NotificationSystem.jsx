import { useState, useEffect, createContext, useContext } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Clock
} from 'lucide-react'

// Context para gerenciar notificações globalmente
const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider')
  }
  return context
}

// Provider de notificações
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  // Função para adicionar notificação
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remover notificações de toast após 5 segundos
    if (notification.type === 'toast') {
      setTimeout(() => {
        removeNotification(id)
      }, 5000)
    }
    
    return id
  }

  // Função para remover notificação
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Função para marcar como lida
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  // Função para marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Função para limpar todas
  const clearAll = () => {
    setNotifications([])
  }

  // Contadores
  const unreadCount = notifications.filter(n => !n.read).length
  const toastNotifications = notifications.filter(n => n.type === 'toast')

  const value = {
    notifications,
    unreadCount,
    showPanel,
    setShowPanel,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer notifications={toastNotifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

// Componente de Toast (notificações flutuantes)
const ToastContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}

const Toast = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.level) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBorderColor = () => {
    switch (notification.level) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  return (
    <Card className={`w-80 border-l-4 ${getBorderColor()} shadow-lg animate-in slide-in-from-right`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{notification.title}</p>
            {notification.message && (
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente do ícone de notificação (para header)
export const NotificationBell = () => {
  const { unreadCount, showPanel, setShowPanel } = useNotifications()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}

// Painel de notificações
export const NotificationPanel = () => {
  const { 
    notifications, 
    showPanel, 
    setShowPanel, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    removeNotification 
  } = useNotifications()

  if (!showPanel) return null

  const getIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  // Filtrar notificações de toast do painel
  const panelNotifications = notifications.filter(n => n.type !== 'toast')

  return (
    <div className="absolute top-12 right-0 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notificações</h3>
          <div className="flex items-center space-x-2">
            {panelNotifications.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Marcar todas como lidas
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Limpar
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-96">
        {panelNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y">
            {panelNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {notification.message && (
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    )}
                    {notification.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {notification.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// Hook para facilitar o uso de notificações
export const useNotify = () => {
  const { addNotification } = useNotifications()

  const notify = {
    success: (title, message, options = {}) => 
      addNotification({ 
        title, 
        message, 
        level: 'success', 
        type: options.toast ? 'toast' : 'panel',
        category: options.category 
      }),
    
    error: (title, message, options = {}) => 
      addNotification({ 
        title, 
        message, 
        level: 'error', 
        type: options.toast ? 'toast' : 'panel',
        category: options.category 
      }),
    
    warning: (title, message, options = {}) => 
      addNotification({ 
        title, 
        message, 
        level: 'warning', 
        type: options.toast ? 'toast' : 'panel',
        category: options.category 
      }),
    
    info: (title, message, options = {}) => 
      addNotification({ 
        title, 
        message, 
        level: 'info', 
        type: options.toast ? 'toast' : 'panel',
        category: options.category 
      })
  }

  return notify
}

export default NotificationSystem

