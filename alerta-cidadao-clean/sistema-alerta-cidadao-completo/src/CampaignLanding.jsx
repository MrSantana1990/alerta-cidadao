import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  Share2, 
  MessageCircle, 
  Copy, 
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react'

const CampaignLanding = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('t')
  
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    consent: false
  })
  const [referralData, setReferralData] = useState(null)

  // Mock campaign data - replace with API call
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data based on slug
        const mockCampaign = {
          id: 1,
          title: 'Alerta Cidadão Campinas',
          slug: slug,
          description: 'Cadastre-se para receber alertas oficiais e informações importantes da Prefeitura de Campinas.',
          message: 'Mantenha-se informado sobre serviços públicos, alertas de emergência, eventos e oportunidades em sua região.',
          status: 'active',
          category: 'Informativo',
          benefits: [
            'Alertas de emergência em tempo real',
            'Informações sobre serviços públicos',
            'Avisos sobre obras e interdições',
            'Oportunidades de emprego e cursos',
            'Eventos culturais e esportivos'
          ]
        }
        
        setCampaign(mockCampaign)
      } catch (err) {
        setError('Erro ao carregar informações da campanha')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [slug])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    handleInputChange('phone', formatted)
  }

  const validateForm = () => {
    if (!formData.phone.trim()) {
      setError('Número de telefone é obrigatório')
      return false
    }
    
    if (!formData.consent) {
      setError('É necessário concordar com os termos para continuar')
      return false
    }
    
    // Basic phone validation
    const digits = formData.phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      setError('Número de telefone inválido')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      // Simulate API call to /api/optin
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful response
      const mockResponse = {
        success: true,
        data: {
          contact_id: 123,
          referral_url: `https://campinas.gov.br/r/abc123def456`,
          whatsapp_share_url: `https://wa.me/?text=Veja%20isso%3A%20https%3A//campinas.gov.br/r/abc123def456`,
          tree_level: token ? 1 : 0
        }
      }
      
      setReferralData(mockResponse.data)
      setSuccess(true)
      
    } catch (err) {
      setError('Erro ao processar cadastro. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyLink = async () => {
    if (referralData?.referral_url) {
      try {
        await navigator.clipboard.writeText(referralData.referral_url)
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }

  const handleWhatsAppShare = () => {
    if (referralData?.whatsapp_share_url) {
      window.open(referralData.whatsapp_share_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Campanha não encontrada</h2>
            <p className="text-gray-600">A campanha solicitada não existe ou não está mais ativa.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success && referralData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Cadastro Realizado com Sucesso!</CardTitle>
            <CardDescription className="text-green-700">
              Você agora receberá alertas oficiais da Prefeitura de Campinas
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Seu número foi cadastrado com segurança e você receberá apenas comunicações oficiais da prefeitura.
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhe com Amigos e Familiares
              </h3>
              <p className="text-blue-800 mb-4 text-sm">
                Ajude a manter sua comunidade informada compartilhando seu link exclusivo:
              </p>
              
              <div className="bg-white p-3 rounded border border-blue-200 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-700 flex-1 mr-2 break-all">
                    {referralData.referral_url}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleWhatsAppShare}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Compartilhar no WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              </div>
            </div>
            
            {referralData.tree_level > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Você foi indicado por um amigo - Nível {referralData.tree_level}
                </Badge>
              </div>
            )}
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Para cancelar o recebimento de mensagens, envie <strong>SAIR</strong> para o número oficial ou 
                <a href="/optout" className="text-blue-600 hover:underline ml-1">
                  clique aqui
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-blue-900">{campaign.title}</CardTitle>
          <CardDescription className="text-blue-700">
            {campaign.description}
          </CardDescription>
          <Badge variant="outline" className="w-fit mx-auto mt-2">
            <Shield className="h-3 w-3 mr-1" />
            Conforme LGPD
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">O que você receberá:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              {campaign.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Número de WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-600">
                Digite seu número com DDD (apenas números)
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Consentimento LGPD
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                Ao fornecer seu número de telefone, você autoriza a Prefeitura Municipal de Campinas 
                a utilizá-lo para envio de alertas oficiais, informações de utilidade pública e 
                comunicações relacionadas aos serviços municipais.
              </p>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => handleInputChange('consent', checked)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm text-yellow-900 leading-relaxed">
                  Eu concordo com o tratamento dos meus dados conforme descrito acima e 
                  <a href="/privacy" className="text-blue-600 hover:underline ml-1" target="_blank">
                    Política de Privacidade
                    <ExternalLink className="h-3 w-3 inline ml-1" />
                  </a>
                </Label>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Quero Receber Alertas
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center text-xs text-gray-600 space-y-1">
            <p>
              Seus dados serão tratados com segurança e você pode cancelar a qualquer momento.
            </p>
            <p>
              Para dúvidas: <a href="mailto:contato@campinas.gov.br" className="text-blue-600 hover:underline">contato@campinas.gov.br</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignLanding

