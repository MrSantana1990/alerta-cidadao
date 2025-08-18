import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react'

const ContactImport = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState(null)

  // Dados mock para preview
  const [previewData, setPreviewData] = useState([
    {
      linha: 1,
      nome: 'João Silva',
      telefone: '(19) 99999-1234',
      email: 'joao@email.com',
      bairro: 'Cambuí',
      status: 'válido'
    },
    {
      linha: 2,
      nome: 'Maria Santos',
      telefone: '(19) 88888-5678',
      email: 'maria@email.com',
      bairro: 'Centro',
      status: 'válido'
    },
    {
      linha: 3,
      nome: 'Pedro Costa',
      telefone: '(19) 77777-9012',
      email: 'email_invalido',
      bairro: 'Jardim Guanabara',
      status: 'erro'
    },
    {
      linha: 4,
      nome: '',
      telefone: '(19) 66666-3456',
      email: 'ana@email.com',
      bairro: 'Vila Industrial',
      status: 'erro'
    }
  ])

  // Mapeamento de campos
  const [fieldMapping, setFieldMapping] = useState({
    nome: 'nome',
    telefone: 'telefone',
    email: 'email',
    bairro: 'bairro'
  })

  const availableFields = [
    { value: 'nome', label: 'Nome' },
    { value: 'telefone', label: 'Telefone' },
    { value: 'email', label: 'Email' },
    { value: 'bairro', label: 'Bairro' },
    { value: 'endereco', label: 'Endereço' },
    { value: 'idade', label: 'Idade' },
    { value: 'genero', label: 'Gênero' },
    { value: 'profissao', label: 'Profissão' },
    { value: 'ignorar', label: 'Ignorar Campo' }
  ]

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // Simular processamento do arquivo
      setTimeout(() => {
        setCurrentStep(2)
      }, 1000)
    }
  }

  const handleFieldMappingChange = (csvField, mappedField) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvField]: mappedField
    }))
  }

  const handlePreview = () => {
    setCurrentStep(3)
  }

  const handleImport = async () => {
    setImporting(true)
    setImportProgress(0)

    // Simular importação
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setImportProgress(i)
    }

    // Simular resultados da importação
    setImportResults({
      total: 4,
      importados: 2,
      erros: 2,
      duplicados: 0,
      detalhes: [
        { linha: 1, status: 'sucesso', mensagem: 'Contato importado com sucesso' },
        { linha: 2, status: 'sucesso', mensagem: 'Contato importado com sucesso' },
        { linha: 3, status: 'erro', mensagem: 'Email inválido' },
        { linha: 4, status: 'erro', mensagem: 'Nome é obrigatório' }
      ]
    })

    setImporting(false)
    setCurrentStep(4)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'válido':
      case 'sucesso':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'erro':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'aviso':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'válido':
      case 'sucesso':
        return 'bg-green-100 text-green-800'
      case 'erro':
        return 'bg-red-100 text-red-800'
      case 'aviso':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const downloadTemplate = () => {
    // Simular download do template
    const csvContent = "nome,telefone,email,bairro\nJoão Silva,(19) 99999-1234,joao@email.com,Cambuí\nMaria Santos,(19) 88888-5678,maria@email.com,Centro"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_contatos.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/contatos')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Importar Contatos</h1>
            <p className="text-gray-600">Importe contatos em massa via arquivo CSV ou Excel</p>
          </div>
        </div>
        
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Template
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Upload</span>
            <span>Mapeamento</span>
            <span>Preview</span>
            <span>Importação</span>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Upload do Arquivo</CardTitle>
            <CardDescription>
              Selecione um arquivo CSV ou Excel com os dados dos contatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-gray-600">ou</p>
                <div>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Selecionar Arquivo</span>
                    </Button>
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Formatos aceitos: CSV, Excel (.xlsx, .xls) - Máximo 10MB
                </p>
              </div>
            </div>

            {file && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-700">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Requisitos do arquivo:</h4>
                  <ul className="mt-2 text-sm text-yellow-800 space-y-1">
                    <li>• Primeira linha deve conter os cabeçalhos das colunas</li>
                    <li>• Campos obrigatórios: Nome e pelo menos um meio de contato (telefone ou email)</li>
                    <li>• Telefones no formato: (XX) XXXXX-XXXX</li>
                    <li>• Emails devem ser válidos</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Field Mapping */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Mapeamento de Campos</CardTitle>
            <CardDescription>
              Associe as colunas do seu arquivo aos campos do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(fieldMapping).map((csvField) => (
                <div key={csvField} className="space-y-2">
                  <Label>Coluna "{csvField}" do arquivo</Label>
                  <Select 
                    value={fieldMapping[csvField]} 
                    onValueChange={(value) => handleFieldMappingChange(csvField, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Voltar
              </Button>
              <Button onClick={handlePreview}>
                Visualizar Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Preview dos Dados</CardTitle>
            <CardDescription>
              Verifique os dados antes de importar. Linhas com erro não serão importadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  2 Válidos
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  <XCircle className="mr-1 h-3 w-3" />
                  2 Erros
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Mostrar apenas erros
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linha</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row) => (
                  <TableRow key={row.linha}>
                    <TableCell>{row.linha}</TableCell>
                    <TableCell className={row.nome ? '' : 'text-red-600'}>
                      {row.nome || 'Campo obrigatório'}
                    </TableCell>
                    <TableCell>{row.telefone}</TableCell>
                    <TableCell className={row.email && !row.email.includes('@') ? 'text-red-600' : ''}>
                      {row.email}
                    </TableCell>
                    <TableCell>{row.bairro}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(row.status)}
                        <Badge className={getStatusColor(row.status)}>
                          {row.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  'Importar Contatos'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Import Results */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {importing && (
            <Card>
              <CardHeader>
                <CardTitle>Importando Contatos...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-center text-gray-600">{importProgress}% concluído</p>
                </div>
              </CardContent>
            </Card>
          )}

          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle>4. Resultado da Importação</CardTitle>
                <CardDescription>
                  Importação concluída. Veja o resumo abaixo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{importResults.total}</p>
                      <p className="text-sm text-gray-600">Total de Linhas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{importResults.importados}</p>
                      <p className="text-sm text-gray-600">Importados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{importResults.erros}</p>
                      <p className="text-sm text-gray-600">Erros</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{importResults.duplicados}</p>
                      <p className="text-sm text-gray-600">Duplicados</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Importação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Mensagem</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResults.detalhes.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{detail.linha}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(detail.status)}
                                <Badge className={getStatusColor(detail.status)}>
                                  {detail.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{detail.mensagem}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => navigate('/contatos')}>
                    Ver Contatos
                  </Button>
                  <Button onClick={() => {
                    setCurrentStep(1)
                    setFile(null)
                    setImportResults(null)
                    setImportProgress(0)
                  }}>
                    Nova Importação
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default ContactImport

