import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Upload,
  Calendar,
  Users
} from 'lucide-react'
import { mockCampaigns } from '../data/mockData'
import CampaignForm from './CampaignForm'

const Campanhas = () => {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [campanhas, setCampanhas] = useState(mockCampaigns)

  const handleCreateCampaign = (campaignData) => {
    const novaCampanha = {
      id: campanhas.length + 1,
      nome: campaignData.titulo,
      objetivo: campaignData.mensagem.substring(0, 50) + '...',
      segmento: campaignData.segmentacao,
      status: campaignData.dataEnvio ? 'Agendada' : 'Em aprovação',
      criacao: new Date().toISOString().split('T')[0],
      envios: 0,
      entregues: 0,
      lidas: 0,
      pendentes: 0,
      optout: 0,
      categoria: campaignData.categoria
    }
    setCampanhas(prev => [novaCampanha, ...prev])
    setShowCampaignForm(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800'
      case 'Concluída': return 'bg-blue-100 text-blue-800'
      case 'Agendada': return 'bg-orange-100 text-orange-800'
      case 'Em aprovação': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const campanhasFiltradas = campanhas.filter(campanha => {
    const matchBusca = campanha.nome.toLowerCase().includes(busca.toLowerCase()) ||
                     campanha.objetivo.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || campanha.status === filtroStatus
    return matchBusca && matchStatus
  })

  if (campanhas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Campanhas</h1>
          <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova campanha de mensagens
                </DialogDescription>
              </DialogHeader>
              <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setShowCampaignForm(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Crie sua primeira campanha</h3>
            <p className="text-gray-600 mb-6">
              Comece enviando mensagens importantes para os cidadãos de Campinas
            </p>
            <Button 
              onClick={() => setShowCampaignForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Campanha
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Campanhas</h1>
        <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova campanha de mensagens
              </DialogDescription>
            </DialogHeader>
            <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setShowCampaignForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar campanhas..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Em aprovação">Em aprovação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Campanhas ({campanhasFiltradas.length})</CardTitle>
          <CardDescription>
            Gerencie todas as suas campanhas de mensagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Métricas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campanhasFiltradas.map((campanha) => (
                <TableRow key={campanha.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campanha.nome}</div>
                      <div className="text-sm text-gray-600">{campanha.objetivo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campanha.categoria}</Badge>
                  </TableCell>
                  <TableCell>{campanha.segmento}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campanha.status)}>
                      {campanha.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campanha.criacao}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{campanha.envios.toLocaleString()} enviadas</div>
                      <div className="text-gray-600">{campanha.entregues.toLocaleString()} entregues</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {campanha.status === 'Ativa' ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Campanhas

