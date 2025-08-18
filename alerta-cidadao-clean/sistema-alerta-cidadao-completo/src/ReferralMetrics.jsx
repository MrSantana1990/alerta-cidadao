import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  UserPlus, 
  Share2,
  Crown,
  TreePine,
  Target,
  Calendar,
  RefreshCw
} from 'lucide-react'

const ReferralMetrics = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [timeRange, setTimeRange] = useState('7d')
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMetrics = {
        summary: {
          total_clicks: 2847,
          unique_clicks: 2156,
          total_optins: 1423,
          total_referrals: 856,
          click_to_optin_rate: 49.9,
          referral_rate: 60.2,
          max_tree_depth: 5,
          avg_tree_depth: 2.3
        },
        daily_stats: [
          { date: '2024-11-01', clicks: 245, optins: 123, referrals: 78 },
          { date: '2024-11-02', clicks: 312, optins: 156, referrals: 94 },
          { date: '2024-11-03', clicks: 289, optins: 142, referrals: 85 },
          { date: '2024-11-04', clicks: 356, optins: 178, referrals: 107 },
          { date: '2024-11-05', clicks: 423, optins: 211, referrals: 127 },
          { date: '2024-11-06', calls: 398, optins: 199, referrals: 119 },
          { date: '2024-11-07', clicks: 445, optins: 223, referrals: 134 }
        ],
        top_referrers: [
          { id: 1, name: 'Maria Silva', phone: '(19) 99999-0001', referrals: 23, level: 0 },
          { id: 2, name: 'João Santos', phone: '(19) 99999-0002', referrals: 19, level: 0 },
          { id: 3, name: 'Ana Costa', phone: '(19) 99999-0003', referrals: 17, level: 1 },
          { id: 4, name: 'Pedro Lima', phone: '(19) 99999-0004', referrals: 15, level: 0 },
          { id: 5, name: 'Carla Souza', phone: '(19) 99999-0005', referrals: 14, level: 2 },
          { id: 6, name: 'Roberto Alves', phone: '(19) 99999-0006', referrals: 12, level: 1 },
          { id: 7, name: 'Lucia Ferreira', phone: '(19) 99999-0007', referrals: 11, level: 0 },
          { id: 8, name: 'Carlos Mendes', phone: '(19) 99999-0008', referrals: 10, level: 3 },
          { id: 9, name: 'Sandra Oliveira', phone: '(19) 99999-0009', referrals: 9, level: 1 },
          { id: 10, name: 'Fernando Rocha', phone: '(19) 99999-0010', referrals: 8, level: 2 }
        ],
        tree_distribution: [
          { level: 0, count: 567, percentage: 39.9 },
          { level: 1, count: 423, percentage: 29.7 },
          { level: 2, count: 289, percentage: 20.3 },
          { level: 3, count: 112, percentage: 7.9 },
          { level: 4, count: 28, percentage: 2.0 },
          { level: 5, count: 4, percentage: 0.3 }
        ],
        recent_events: [
          { id: 1, type: 'optin', contact: 'Maria Silva', referrer: 'João Santos', timestamp: '2024-11-07T14:30:00Z', level: 2 },
          { id: 2, type: 'click', contact: null, referrer: 'Ana Costa', timestamp: '2024-11-07T14:25:00Z', level: null },
          { id: 3, type: 'share', contact: 'Pedro Lima', referrer: null, timestamp: '2024-11-07T14:20:00Z', level: 0 },
          { id: 4, type: 'optin', contact: 'Carla Souza', referrer: 'Maria Silva', timestamp: '2024-11-07T14:15:00Z', level: 1 },
          { id: 5, type: 'click', contact: null, referrer: 'João Santos', timestamp: '2024-11-07T14:10:00Z', level: null }
        ]
      }
      
      setMetrics(mockMetrics)
      setLoading(false)
    }

    fetchMetrics()
  }, [selectedCampaign, timeRange])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'click': return 'bg-blue-100 text-blue-800'
      case 'optin': return 'bg-green-100 text-green-800'
      case 'share': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'click': return 'Clique'
      case 'optin': return 'Cadastro'
      case 'share': return 'Compartilhamento'
      default: return type
    }
  }

  const getLevelColor = (level) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800', 
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-pink-100 text-pink-800'
    ]
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

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

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Erro ao carregar métricas</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Referência</h2>
          <p className="text-gray-600">Acompanhe o desempenho do sistema compartilha-e-cresce</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Selecionar campanha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as campanhas</SelectItem>
              <SelectItem value="1">Alerta Cidadão</SelectItem>
              <SelectItem value="2">Vacinação COVID-19</SelectItem>
              <SelectItem value="3">Defesa Civil</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Hoje</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Cliques</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(metrics.summary.total_clicks)}</p>
                <p className="text-xs text-gray-500">{formatNumber(metrics.summary.unique_clicks)} únicos</p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos Cadastros</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(metrics.summary.total_optins)}</p>
                <p className="text-xs text-gray-500">Taxa: {formatPercentage(metrics.summary.click_to_optin_rate)}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Indicações</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(metrics.summary.total_referrals)}</p>
                <p className="text-xs text-gray-500">Taxa: {formatPercentage(metrics.summary.referral_rate)}</p>
              </div>
              <Share2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profundidade Máxima</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.summary.max_tree_depth}</p>
                <p className="text-xs text-gray-500">Média: {metrics.summary.avg_tree_depth.toFixed(1)}</p>
              </div>
              <TreePine className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Atividade Diária
            </CardTitle>
            <CardDescription>
              Cliques, cadastros e indicações por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.daily_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                  formatter={(value, name) => [formatNumber(value), name === 'clicks' ? 'Cliques' : name === 'optins' ? 'Cadastros' : 'Indicações']}
                />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="clicks" />
                <Line type="monotone" dataKey="optins" stroke="#10B981" strokeWidth={2} name="optins" />
                <Line type="monotone" dataKey="referrals" stroke="#8B5CF6" strokeWidth={2} name="referrals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tree Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TreePine className="h-5 w-5 mr-2" />
              Distribuição da Árvore
            </CardTitle>
            <CardDescription>
              Número de pessoas por nível de indicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.tree_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="level" 
                  tickFormatter={(value) => `Nível ${value}`}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `Nível ${value}`}
                  formatter={(value, name) => [
                    name === 'count' ? formatNumber(value) : formatPercentage(value),
                    name === 'count' ? 'Pessoas' : 'Porcentagem'
                  ]}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Top 10 Indicadores
            </CardTitle>
            <CardDescription>
              Pessoas que mais trouxeram novos cadastros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead className="text-right">Indicações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.top_referrers.map((referrer, index) => (
                  <TableRow key={referrer.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {index < 3 && (
                          <Crown className={`h-4 w-4 mr-1 ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-orange-600'
                          }`} />
                        )}
                        #{index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referrer.name}</div>
                        <div className="text-sm text-gray-600">{referrer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(referrer.level)}>
                        Nível {referrer.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {referrer.referrals}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas interações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recent_events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getEventTypeColor(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <div>
                      <div className="text-sm font-medium">
                        {event.contact || 'Visitante anônimo'}
                      </div>
                      {event.referrer && (
                        <div className="text-xs text-gray-600">
                          Indicado por: {event.referrer}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      {new Date(event.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {event.level !== null && (
                      <Badge variant="outline" className="text-xs">
                        Nível {event.level}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Funil de Conversão
          </CardTitle>
          <CardDescription>
            Jornada do clique até a indicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MousePointer className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Cliques no Link</div>
                  <div className="text-sm text-blue-700">Pessoas que clicaram no link de referência</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.summary.total_clicks)}</div>
                <div className="text-sm text-blue-700">100%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-600">
                ↓ {formatPercentage(metrics.summary.click_to_optin_rate)} se cadastram
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Novos Cadastros</div>
                  <div className="text-sm text-green-700">Pessoas que se cadastraram</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{formatNumber(metrics.summary.total_optins)}</div>
                <div className="text-sm text-green-700">{formatPercentage(metrics.summary.click_to_optin_rate)}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-600">
                ↓ {formatPercentage(metrics.summary.referral_rate)} fazem indicações
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Share2 className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">Indicações Feitas</div>
                  <div className="text-sm text-purple-700">Pessoas que indicaram outras</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(metrics.summary.total_referrals)}</div>
                <div className="text-sm text-purple-700">{formatPercentage(metrics.summary.referral_rate)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReferralMetrics

