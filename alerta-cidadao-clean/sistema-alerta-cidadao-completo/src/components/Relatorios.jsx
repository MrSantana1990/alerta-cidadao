import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Download, 
  Calendar,
  FileText,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  Plus
} from 'lucide-react'
import { mockReports } from '../data/mockData'

const Relatorios = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [relatorios, setRelatorios] = useState(mockReports)
  const [novoRelatorio, setNovoRelatorio] = useState({
    tipo: '',
    periodo: '',
    campanhas: []
  })

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Mensal': return 'bg-blue-100 text-blue-800'
      case 'Semanal': return 'bg-green-100 text-green-800'
      case 'Campanha': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateReport = () => {
    const novoId = relatorios.length + 1
    const relatorio = {
      id: novoId,
      titulo: `Relatório ${novoRelatorio.tipo} - ${novoRelatorio.periodo}`,
      tipo: novoRelatorio.tipo,
      periodo: novoRelatorio.periodo,
      campanhas: Math.floor(Math.random() * 10) + 1,
      mensagens: Math.floor(Math.random() * 50000) + 10000,
      taxaEntrega: (Math.random() * 5 + 95).toFixed(1),
      geradoEm: new Date().toISOString().split('T')[0]
    }
    
    setRelatorios(prev => [relatorio, ...prev])
    setShowCreateDialog(false)
    setNovoRelatorio({ tipo: '', periodo: '', campanhas: [] })
    alert('Relatório gerado com sucesso!')
  }

  const handleDownloadReport = (relatorio) => {
    // Simular download
    alert(`Baixando relatório: ${relatorio.titulo}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerar Novo Relatório</DialogTitle>
              <DialogDescription>
                Configure os parâmetros para gerar um novo relatório
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Relatório</Label>
                <Select value={novoRelatorio.tipo} onValueChange={(value) => setNovoRelatorio(prev => ({...prev, tipo: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Relatório Mensal</SelectItem>
                    <SelectItem value="Semanal">Relatório Semanal</SelectItem>
                    <SelectItem value="Campanha">Análise de Campanha</SelectItem>
                    <SelectItem value="Personalizado">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Input
                  id="periodo"
                  value={novoRelatorio.periodo}
                  onChange={(e) => setNovoRelatorio(prev => ({...prev, periodo: e.target.value}))}
                  placeholder="Ex: Janeiro 2024, Semana 1-7 Jan, etc."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateReport}
                  disabled={!novoRelatorio.tipo || !novoRelatorio.periodo}
                >
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Mensagens
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156,847</div>
            <p className="text-xs text-green-600 mt-1">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Entrega Média
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <p className="text-xs text-green-600 mt-1">
              +0.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Campanhas Executadas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-green-600 mt-1">
              +8 vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alcance Total
            </CardTitle>
            <Users className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,456</div>
            <p className="text-xs text-green-600 mt-1">
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Relatórios Gerados</span>
          </CardTitle>
          <CardDescription>
            Histórico de relatórios e análises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Relatório</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Campanhas</TableHead>
                <TableHead>Mensagens</TableHead>
                <TableHead>Taxa Entrega</TableHead>
                <TableHead>Gerado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorios.map((relatorio) => (
                <TableRow key={relatorio.id}>
                  <TableCell>
                    <div className="font-medium">{relatorio.titulo}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoColor(relatorio.tipo)}>
                      {relatorio.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{relatorio.periodo}</TableCell>
                  <TableCell>{relatorio.campanhas}</TableCell>
                  <TableCell>{relatorio.mensagens.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">
                      {relatorio.taxaEntrega}%
                    </span>
                  </TableCell>
                  <TableCell>{relatorio.geradoEm}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(relatorio)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gráficos e Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance por Mês</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de Performance</p>
                <p className="text-sm text-gray-500">Dados dos últimos 6 meses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Taxa de Engajamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de Engajamento</p>
                <p className="text-sm text-gray-500">Leitura e interação por campanha</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Relatorios

