import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  ArrowLeft,
  Play, 
  Pause, 
  Edit, 
  Copy,
  Trash2,
  Download,
  Users,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { mockCampaigns } from './data/mockData'
const CampaignDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dados mock para métricas detalhadas
  const [metrics, setMetrics] = useState({
    totalEnviados: 2340,
    entregues: 2298,
    lidas: 1876,
    cliques: 234,
    respostas: 45,
    optouts: 12,
    erros: 42,
    taxaEntrega: 98.2,
    taxaLeitura: 81.6,
    taxaClique: 12.5,
    taxaResposta: 2.4
  })

  // Dados mock para histórico de envios
  const [sendHistory, setSendHistory] = useState([
    {
      id: 1,
      data: '2024-01-15 09:00',
      lote: 'Lote 1',
      destinatarios: 500,
      status: 'Concluído',
      entregues: 498,
      falhas: 2
    },
    {
      id: 2,
      data: '2024-01-15 09:15',
      lote: 'Lote 2',
      destinatarios: 500,
      status: 'Concluído',
      entregues: 495,
      falhas: 5
    },
    {
      id: 3,
      data: '2024-01-15 09:30',
      lote: 'Lote 3',
      destinatarios: 500,
      status: 'Concluído',
      entregues: 500,
      falhas: 0
    },
    {
      id: 4,
      data: '2024-01-15 09:45',
      lote: 'Lote 4',
      destinatarios: 500,
      status: 'Em andamento',
      entregues: 456,
      falhas: 2
    }
  ])

  useEffect(() => {
    // Simular carregamento de dados
    const foundCampaign = mockCampaigns.find(c => c.id === parseInt(id))
    if (foundCampaign) {
      setCampaign(foundCampaign)
    }
    setLoading(false)
  }, [id])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800'
      case 'Concluída': return 'bg-blue-100 text-blue-800'
      case 'Agendada': return 'bg-orange-100 text-orange-800'
      case 'Em aprovação': return 'bg-yellow-100 text-yellow-800'
      case 'Pausada': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePauseCampaign = () => {
    setCampaign(prev => ({ ...prev, status: 'Pausada' }))
  }

  const handleResumeCampaign = () => {
    setCampaign(prev => ({ ...prev, status: 'Ativa' }))
  }

  const handleDuplicateCampaign = () => {
    // Implementar lógica de duplicação
    console.log('Duplicar campanha:', campaign.id)
  }

  const handleDeleteCampaign = () => {
    // Implementar lógica de exclusão
    console.log('Excluir campanha:', campaign.id)
    navigate('/campanhas')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando detalhes da campanha...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Campanha não encontrada</h2>
        <p className="text-gray-600 mb-4">A campanha solicitada não existe ou foi removida.</p>
        <Button onClick={() => navigate('/campanhas')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Campanhas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/campanhas')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.nome}</h1>
            <p className="text-gray-600">{campaign.objetivo}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
          
          {campaign.status === 'Ativa' ? (
            <Button variant="outline" onClick={handlePauseCampaign}>
              <Pause className="mr-2 h-4 w-4" />
              Pausar
            </Button>
          ) : campaign.status === 'Pausada' ? (
            <Button variant="outline" onClick={handleResumeCampaign}>
              <Play className="mr-2 h-4 w-4" />
              Retomar
            </Button>
          ) : null}
          
          <Button variant="outline" onClick={() => navigate(`/campanhas/${id}/editar`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          <Button variant="outline" onClick={handleDuplicateCampaign}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCampaign} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enviados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalEnviados.toLocaleString()}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Entrega</p>
                <p className="text-2xl font-bold text-green-600">{metrics.taxaEntrega}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Leitura</p>
                <p className="text-2xl font-bold text-cyan-600">{metrics.taxaLeitura}%</p>
              </div>
              <Eye className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Respostas</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.respostas}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes em Abas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Campanha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Categoria</Label>
                  <p className="text-gray-900">{campaign.categoria}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Segmentação</Label>
                  <p className="text-gray-900">{campaign.segmento}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                  <p className="text-gray-900">{new Date(campaign.criacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progresso de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Entregues</span>
                    <span>{metrics.entregues}/{metrics.totalEnviados}</span>
                  </div>
                  <Progress value={(metrics.entregues / metrics.totalEnviados) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Lidas</span>
                    <span>{metrics.lidas}/{metrics.entregues}</span>
                  </div>
                  <Progress value={(metrics.lidas / metrics.entregues) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cliques</span>
                    <span>{metrics.cliques}/{metrics.lidas}</span>
                  </div>
                  <Progress value={(metrics.cliques / metrics.lidas) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.entregues.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Mensagens Entregues</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.lidas.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Mensagens Lidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.cliques}</p>
                <p className="text-sm text-gray-600">Cliques</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.respostas}</p>
                <p className="text-sm text-gray-600">Respostas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.optouts}</p>
                <p className="text-sm text-gray-600">Opt-outs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{metrics.erros}</p>
                <p className="text-sm text-gray-600">Erros</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Envios</CardTitle>
              <CardDescription>
                Detalhes de todos os lotes enviados para esta campanha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entregues</TableHead>
                    <TableHead>Falhas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sendHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data}</TableCell>
                      <TableCell>{item.lote}</TableCell>
                      <TableCell>{item.destinatarios}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Concluído' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.entregues}</TableCell>
                      <TableCell className={item.falhas > 0 ? 'text-red-600' : 'text-green-600'}>
                        {item.falhas}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  Olá [NOME],

                  A Prefeitura de Campinas informa que a 5ª dose da vacina COVID-19 está disponível para pessoas com 60 anos ou mais.

                  📍 Locais de vacinação:
                  - UBS do seu bairro
                  - Centros de Saúde
                  - Postos volantes

                  🕒 Horário: Segunda a sexta, das 8h às 17h

                  Documentos necessários:
                  - RG ou CPF
                  - Cartão de vacinação
                  - Comprovante de residência

                  Sua saúde é nossa prioridade!

                  Prefeitura Municipal de Campinas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CampaignDetails

