import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Upload, 
  Download, 
  Link, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Users,
  MessageCircle,
  Share2
} from 'lucide-react'

const ReferralLinkGenerator = () => {
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [csvFile, setCsvFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [generatedLinks, setGeneratedLinks] = useState([])

  // Mock campaigns data
  useEffect(() => {
    const mockCampaigns = [
      { id: 1, title: 'Alerta Cidadão Campinas', slug: 'alerta-cidadao', status: 'active' },
      { id: 2, title: 'Vacinação COVID-19', slug: 'vacinacao-covid', status: 'active' },
      { id: 3, title: 'Defesa Civil - Chuvas', slug: 'defesa-civil-chuvas', status: 'active' },
    ]
    setCampaigns(mockCampaigns)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Por favor, selecione um arquivo CSV válido')
        return
      }
      setCsvFile(file)
      setError('')
    }
  }

  const handleGenerate = async () => {
    if (!selectedCampaign) {
      setError('Selecione uma campanha')
      return
    }
    
    if (!csvFile) {
      setError('Selecione um arquivo CSV')
      return
    }
    
    setProcessing(true)
    setError('')
    setProgress(0)
    
    try {
      // Simulate file processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Mock results
      const mockResults = {
        total_rows: 150,
        valid_phones: 145,
        invalid_phones: 5,
        new_contacts: 120,
        existing_contacts: 25,
        new_links: 145,
        existing_links: 0,
        errors: 5
      }
      
      const mockLinks = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Contato ${i + 1}`,
        phone: `(19) 9999${String(i).padStart(4, '0')}`,
        referral_url: `https://campinas.gov.br/r/abc${i}def${i}ghi`,
        whatsapp_message: `Veja isso: https://campinas.gov.br/r/abc${i}def${i}ghi`,
        created_at: new Date().toISOString()
      }))
      
      setResults(mockResults)
      setGeneratedLinks(mockLinks)
      
    } catch (err) {
      setError('Erro ao processar arquivo. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleCopyWhatsAppMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const handleDownloadResults = () => {
    if (!generatedLinks.length) return
    
    // Create CSV content
    const headers = ['Nome', 'Telefone', 'Link de Referência', 'Mensagem WhatsApp']
    const csvContent = [
      headers.join(','),
      ...generatedLinks.map(link => [
        `"${link.name}"`,
        `"${link.phone}"`,
        `"${link.referral_url}"`,
        `"${link.whatsapp_message}"`
      ].join(','))
    ].join('\n')
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `links-referencia-${selectedCampaign}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerador de Links de Referência</h1>
          <p className="text-gray-600">Crie links únicos para rastreamento de indicações</p>
        </div>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="h-5 w-5 mr-2" />
            Configuração da Geração
          </CardTitle>
          <CardDescription>
            Selecione a campanha e faça upload do arquivo CSV com os contatos
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign">Campanha *</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma campanha" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id.toString()}>
                      {campaign.title}
                      <Badge variant="outline" className="ml-2">
                        {campaign.status}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV *</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Formato do CSV esperado:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Colunas obrigatórias:</strong> phone (telefone)</p>
              <p><strong>Colunas opcionais:</strong> name (nome)</p>
              <p><strong>Exemplo:</strong></p>
              <code className="block bg-white p-2 rounded text-xs mt-2">
                name,phone<br/>
                João Silva,(19) 99999-9999<br/>
                Maria Santos,19988887777
              </code>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={processing || !selectedCampaign || !csvFile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Gerar Links
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {processing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processando arquivo...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-600">
                Validando números de telefone e gerando links únicos...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Processamento Concluído
            </CardTitle>
            <CardDescription>
              Resumo da geração de links de referência
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.total_rows}</div>
                <div className="text-sm text-gray-600">Total de Linhas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.valid_phones}</div>
                <div className="text-sm text-gray-600">Telefones Válidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{results.new_links}</div>
                <div className="text-sm text-gray-600">Links Gerados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleDownloadResults}
                variant="outline"
                className="mr-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Resultados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Links Table */}
      {generatedLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Links Gerados ({generatedLinks.length})
            </CardTitle>
            <CardDescription>
              Primeiros 10 links gerados - baixe o arquivo completo acima
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Link de Referência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      {link.name || 'Sem nome'}
                    </TableCell>
                    <TableCell>{link.phone}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {link.referral_url.length > 40 
                          ? `${link.referral_url.substring(0, 40)}...` 
                          : link.referral_url
                        }
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(link.referral_url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyWhatsAppMessage(link.whatsapp_message)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Como Usar os Links Gerados
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                <h4 className="font-medium text-blue-900">1. Envio Manual</h4>
              </div>
              <p className="text-sm text-blue-800">
                Copie as mensagens e envie manualmente via WhatsApp Web para cada contato.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Share2 className="h-5 w-5 mr-2 text-green-600" />
                <h4 className="font-medium text-green-900">2. Compartilhamento</h4>
              </div>
              <p className="text-sm text-green-800">
                Cada pessoa que clicar no link poderá se cadastrar e gerar seu próprio link.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                <h4 className="font-medium text-purple-900">3. Rastreamento</h4>
              </div>
              <p className="text-sm text-purple-800">
                Acompanhe cliques, cadastros e a árvore de indicações no Dashboard.
              </p>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Cada link é único e rastreável. Não compartilhe links entre diferentes contatos, 
              pois isso pode afetar as métricas de rastreamento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReferralLinkGenerator

