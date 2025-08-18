import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Share2,
  MousePointer,
  UserPlus,
  TreePine,
  Crown,
  Plus,
  Download,
  Calendar,
  Eye
} from 'lucide-react'

// Import the new ReferralMetrics component
import ReferralMetrics from './ReferralMetrics'
import { mockDashboardStats, mockRecentCampaigns } from '../data/mockData'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData = {
        summary: {
          totalMessages: mockDashboardStats.mensagensEnviadas,
          activeUsers: mockDashboardStats.usuariosAtivos,
          deliveryRate: mockDashboardStats.taxaEntrega,
          activeCampaigns: mockDashboardStats.campanhasAtivas,
          // New referral metrics
          totalClicks: 2847,
          totalOptins: 1423,
          totalReferrals: 856,
          referralRate: 60.2
        },
        recentActivity: [
          { id: 1, type: 'campaign', message: 'Nova campanha "Vacinação Infantil" criada', time: '2 min atrás' },
          { id: 2, type: 'referral', message: '15 novos cadastros via indicação', time: '5 min atrás' },
          { id: 3, type: 'message', message: '1.2k mensagens enviadas com sucesso', time: '10 min atrás' },
          { id: 4, type: 'user', message: '23 novos usuários cadastrados', time: '15 min atrás' },
        ],
        campaignStats: [
          { name: 'Alerta Cidadão', sent: 4500, delivered: 4230, read: 3890 },
          { name: 'Vacinação', sent: 3200, delivered: 3040, read: 2850 },
          { name: 'Defesa Civil', sent: 2800, delivered: 2650, read: 2400 },
          { name: 'Eventos', sent: 1900, delivered: 1820, read: 1650 },
        ],
        // New referral data
        referralGrowth: [
          { date: '01/11', clicks: 245, optins: 123, referrals: 78 },
          { date: '02/11', clicks: 312, optins: 156, referrals: 94 },
          { date: '03/11', clicks: 289, optins: 142, referrals: 85 },
          { date: '04/11', clicks: 356, optins: 178, referrals: 107 },
          { date: '05/11', clicks: 423, optins: 211, referrals: 127 },
          { date: '06/11', clicks: 398, optins: 199, referrals: 119 },
          { date: '07/11', clicks: 445, optins: 223, referrals: 134 }
        ],
        topReferrers: [
          { name: 'Maria Silva', referrals: 23, level: 0 },
          { name: 'João Santos', referrals: 19, level: 0 },
          { name: 'Ana Costa', referrals: 17, level: 1 },
          { name: 'Pedro Lima', referrals: 15, level: 0 },
          { name: 'Carla Souza', referrals: 14, level: 2 }
        ]
      }
      
      setDashboardData(mockData)
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === 'referrals') {
    return <ReferralMetrics />
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'referrals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Compartilha-e-Cresce
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(dashboardData.summary.totalMessages)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% este mês
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(dashboardData.summary.activeUsers)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% este mês
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Entrega</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.summary.deliveryRate}%</p>
                <Progress value={dashboardData.summary.deliveryRate} className="mt-2" />
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.summary.activeCampaigns}</p>
                <p className="text-xs text-gray-600 mt-1">3 agendadas</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Referral Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Cliques em Links</p>
                <p className="text-2xl font-bold text-blue-800">{formatNumber(dashboardData.summary.totalClicks)}</p>
                <p className="text-xs text-blue-600 mt-1">Sistema de referência</p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Novos Cadastros</p>
                <p className="text-2xl font-bold text-green-800">{formatNumber(dashboardData.summary.totalOptins)}</p>
                <p className="text-xs text-green-600 mt-1">Via indicação</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Indicações</p>
                <p className="text-2xl font-bold text-purple-800">{formatNumber(dashboardData.summary.totalReferrals)}</p>
                <p className="text-xs text-purple-600 mt-1">Pessoas ativas</p>
              </div>
              <Share2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Taxa de Indicação</p>
                <p className="text-2xl font-bold text-orange-800">{dashboardData.summary.referralRate}%</p>
                <Progress value={dashboardData.summary.referralRate} className="mt-2" />
              </div>
              <TreePine className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance das Campanhas</CardTitle>
            <CardDescription>Mensagens enviadas, entregues e lidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.campaignStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3B82F6" name="Enviadas" />
                <Bar dataKey="delivered" fill="#10B981" name="Entregues" />
                <Bar dataKey="read" fill="#8B5CF6" name="Lidas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Referral Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Crescimento por Indicação
            </CardTitle>
            <CardDescription>Evolução do sistema compartilha-e-cresce</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.referralGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="Cliques" />
                <Line type="monotone" dataKey="optins" stroke="#10B981" strokeWidth={2} name="Cadastros" />
                <Line type="monotone" dataKey="referrals" stroke="#8B5CF6" strokeWidth={2} name="Indicações" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'campaign' ? 'bg-blue-100' :
                    activity.type === 'referral' ? 'bg-purple-100' :
                    activity.type === 'message' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'campaign' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'referral' && <Share2 className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'message' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Top Indicadores
            </CardTitle>
            <CardDescription>Pessoas que mais trouxeram novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{referrer.name}</p>
                      <Badge variant="outline" className="text-xs">
                        Nível {referrer.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{referrer.referrals}</p>
                    <p className="text-xs text-gray-600">indicações</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab('referrals')}
              >
                Ver Métricas Completas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
          <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-pink-600 hover:bg-pink-700">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Nova Campanha</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Importar Contatos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Share2 className="h-6 w-6" />
              <span className="text-sm">Gerar Links</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Eye className="h-6 w-6" />
              <span className="text-sm">Ver Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

