import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react'

const OptOutPage = () => {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
    setPhone(formatted)
    setError('')
  }

  const validatePhone = () => {
    if (!phone.trim()) {
      setError('Número de telefone é obrigatório')
      return false
    }
    
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      setError('Número de telefone inválido')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePhone()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Simulate API call to /api/optout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful response
      setSuccess(true)
      
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Opt-out Realizado com Sucesso</CardTitle>
            <CardDescription className="text-green-700">
              Seu número foi removido da nossa base de dados
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Confirmação:</strong> O número <strong>{phone}</strong> foi removido com sucesso. 
                Você não receberá mais mensagens do Sistema Alerta Cidadão.
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">O que acontece agora?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                  Seu número foi imediatamente removido de todas as campanhas ativas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                  Você não receberá mais alertas ou mensagens da prefeitura
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                  Seus dados foram marcados como "opt-out" em nosso sistema
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                  Você pode se cadastrar novamente a qualquer momento
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="text-center space-y-4">
              <h4 className="font-semibold text-gray-900">Mudou de ideia?</h4>
              <p className="text-sm text-gray-600">
                Se você quiser voltar a receber alertas oficiais da Prefeitura de Campinas, 
                pode se cadastrar novamente através de qualquer link de campanha.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1 sm:flex-none"
                >
                  Voltar ao Início
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/c/alerta-cidadao'}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                >
                  Cadastrar Novamente
                </Button>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-600">
              <p>
                Para dúvidas sobre privacidade: 
                <a href="mailto:privacidade@campinas.gov.br" className="text-blue-600 hover:underline ml-1">
                  privacidade@campinas.gov.br
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Cancelar Recebimento de Mensagens</CardTitle>
          <CardDescription className="text-red-700">
            Remova seu número da base de dados do Sistema Alerta Cidadão
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Atenção:</strong> Ao fazer opt-out, você deixará de receber alertas importantes 
              da Prefeitura de Campinas, incluindo avisos de emergência e informações de utilidade pública.
            </AlertDescription>
          </Alert>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Outras formas de cancelar:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-3 text-green-600" />
                <span>Envie <strong>SAIR</strong> para o número oficial da prefeitura</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-blue-600" />
                <span>Ligue para <strong>(19) 3794-6000</strong> e solicite a remoção</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-purple-600" />
                <span>Envie um e-mail para <strong>contato@campinas.gov.br</strong></span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de WhatsApp para Remover *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-600">
                Digite o número que deseja remover (com DDD)
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Confirmação de Opt-out</h4>
              <p className="text-sm text-yellow-800">
                Ao confirmar, seu número será imediatamente removido de todas as campanhas ativas 
                e você não receberá mais mensagens do Sistema Alerta Cidadão. Esta ação pode ser 
                revertida a qualquer momento através de um novo cadastro.
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Confirmar Opt-out
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="text-center text-xs text-gray-600 space-y-1">
            <p>
              Esta ação está em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <p>
              Seus dados serão mantidos apenas para fins de auditoria e controle de opt-out.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OptOutPage

