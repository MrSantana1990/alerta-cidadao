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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit, 
  Trash2,
  Phone,
  MapPin,
  Tag
} from 'lucide-react'
import { mockContacts } from '../data/mockData'

const Contatos = () => {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroBairro, setFiltroBairro] = useState('todos')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [contatos, setContatos] = useState(mockContacts)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800'
      case 'Inativo': return 'bg-gray-100 text-gray-800'
      case 'Opt-out': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const bairrosUnicos = [...new Set(contatos.map(c => c.bairro))].sort()

  const contatosFiltrados = contatos.filter(contato => {
    const matchBusca = contato.nome.toLowerCase().includes(busca.toLowerCase()) ||
                     contato.telefone.includes(busca) ||
                     contato.bairro.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || contato.status === filtroStatus
    const matchBairro = filtroBairro === 'todos' || contato.bairro === filtroBairro
    return matchBusca && matchStatus && matchBairro
  })

  const handleImportContacts = () => {
    // Simular importação de contatos
    const novosContatos = [
      {
        id: contatos.length + 1,
        nome: "Contato Importado 1",
        telefone: "(19) 91234-5678",
        bairro: "Cambuí",
        status: "Ativo",
        tags: ["Importado"],
        ultimaInteracao: new Date().toISOString().split('T')[0]
      },
      {
        id: contatos.length + 2,
        nome: "Contato Importado 2",
        telefone: "(19) 91234-5679",
        bairro: "Centro",
        status: "Ativo",
        tags: ["Importado"],
        ultimaInteracao: new Date().toISOString().split('T')[0]
      }
    ]
    
    setContatos(prev => [...novosContatos, ...prev])
    setShowImportDialog(false)
    alert('2 contatos importados com sucesso!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Contatos</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-4 w-4" />
                Importar Contatos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Contatos</DialogTitle>
                <DialogDescription>
                  Faça upload de um arquivo CSV ou Excel com os contatos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="arquivo">Arquivo de Contatos</Label>
                  <Input
                    id="arquivo"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Formatos aceitos: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Formato esperado:</h4>
                  <p className="text-sm text-blue-800">
                    Nome, Telefone, Bairro, Tags (separadas por ;)
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Exemplo: João Silva, (19) 99999-9999, Cambuí, Idoso;Vacinação
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleImportContacts}>
                    Importar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, telefone ou bairro..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Opt-out">Opt-out</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroBairro} onValueChange={setFiltroBairro}>
              <SelectTrigger className="w-full lg:w-48">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os bairros</SelectItem>
                {bairrosUnicos.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {contatos.filter(c => c.status === 'Ativo').length}
            </div>
            <p className="text-sm text-gray-600">Contatos Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {contatos.filter(c => c.status === 'Inativo').length}
            </div>
            <p className="text-sm text-gray-600">Contatos Inativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {contatos.filter(c => c.status === 'Opt-out').length}
            </div>
            <p className="text-sm text-gray-600">Opt-out</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {bairrosUnicos.length}
            </div>
            <p className="text-sm text-gray-600">Bairros Cobertos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos ({contatosFiltrados.length})</CardTitle>
          <CardDescription>
            Gerencie sua base de contatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatosFiltrados.map((contato) => (
                <TableRow key={contato.id}>
                  <TableCell>
                    <div className="font-medium">{contato.nome}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{contato.telefone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{contato.bairro}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contato.status)}>
                      {contato.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contato.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{contato.ultimaInteracao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
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

export default Contatos

