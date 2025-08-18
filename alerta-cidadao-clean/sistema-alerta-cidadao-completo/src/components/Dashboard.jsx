import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Users, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Download,
  Calendar,
  Eye
} from 'lucide-react'
import { mockDashboardStats, mockRecentCampaigns } from '../data/mockData'

const Dashboard = () => {
  const stats = mockDashboardStats
  const recentCampaigns = mockRecentCampaigns

  const kpiCards = [
    {
      title: "Mensagens Enviadas",
      value: stats.mensagensEnviadas.toLocaleString(),
      change: `+${stats.crescimentoMensal.mensagens}% vs mês anterior`,
      icon: Send,
      color: "text-blue-600"
    },
    {
      title: "Usuários Ativos",
      value: stats.usuariosAtivos.toLocaleString(),
      change: `+${stats.crescimentoMensal.usuarios}% vs mês anterior`,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Taxa de Entrega",
      value: `${stats.taxaEntrega}%`,
      change: `+${stats.crescimentoMensal.entrega}% vs mês anterior`,
      icon: CheckCircle,
      color: "text-cyan-600"
    },
    {
      title: "Campanhas Ativas",
      value: stats.campanhasAtivas.toString(),
      change: `+${stats.crescimentoMensal.campanhas}% vs mês anterior`,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800'
      case 'Concluída': return 'bg-blue-100 text-blue-800'
      case 'Agendada': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campanhas Recentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Campanhas Recentes</span>
                </CardTitle>
                <CardDescription>
                  Últimas campanhas executadas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{campaign.nome}</h4>
                    <p className="text-sm text-gray-600">
                      {campaign.envios.toLocaleString()} enviadas • {campaign.entregues.toLocaleString()} entregues
                    </p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Ações Rápidas</span>
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button className="justify-start h-12 bg-pink-600 hover:bg-pink-700">
                <Plus className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Nova Campanha</div>
                  <div className="text-xs opacity-90">Criar campanha de mensagens</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-12">
                <Download className="mr-3 h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Importar Contatos</div>
                  <div className="text-xs text-gray-600">Adicionar novos contatos</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-12">
                <Calendar className="mr-3 h-5 w-5 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium">Agendar Envio</div>
                  <div className="text-xs text-gray-600">Programar mensagens</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-12">
                <Eye className="mr-3 h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Ver Relatórios</div>
                  <div className="text-xs text-gray-600">Análises e métricas</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

