import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Phone,
  Globe,
  Key,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Estados para configurações
  const [profileData, setProfileData] = useState({
    nome: 'Administrador Sistema',
    email: 'admin@campinas.sp.gov.br',
    telefone: '(19) 3735-1234',
    cargo: 'Coordenador de Comunicação',
    departamento: 'Secretaria de Comunicação'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailCampanhas: true,
    emailRelatorios: true,
    emailErros: true,
    smsAlertas: false,
    pushNotifications: true,
    frequenciaRelatorios: 'diario'
  })

  const [systemSettings, setSystemSettings] = useState({
    limiteMensagensDia: 10000,
    limiteContatos: 50000,
    backupAutomatico: true,
    frequenciaBackup: 'diario',
    retencaoDados: '365',
    logLevel: 'info'
  })

  const [apiSettings, setApiSettings] = useState({
    smsProvider: 'twilio',
    emailProvider: 'sendgrid',
    whatsappProvider: 'twilio',
    rateLimitRpm: 100,
    timeoutSegundos: 30
  })

  const handleSave = async (section) => {
    setSaving(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    setSaved(true)
    
    // Reset saved state after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const handleExportSettings = () => {
    const settings = {
      profile: profileData,
      notifications: notificationSettings,
      system: systemSettings,
      api: apiSettings
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'configuracoes_sistema.json'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportSettings = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const settings = JSON.parse(event.target.result)
          if (settings.profile) setProfileData(settings.profile)
          if (settings.notifications) setNotificationSettings(settings.notifications)
          if (settings.system) setSystemSettings(settings.system)
          if (settings.api) setApiSettings(settings.api)
          alert('Configurações importadas com sucesso!')
        } catch (error) {
          alert('Erro ao importar configurações. Verifique o formato do arquivo.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema e seu perfil</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div>
            <Input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <Label htmlFor="import-settings" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </span>
              </Button>
            </Label>
          </div>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>APIs</span>
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil e contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={profileData.nome}
                    onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profileData.telefone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={profileData.cargo}
                    onChange={(e) => setProfileData(prev => ({ ...prev, cargo: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={profileData.departamento}
                  onChange={(e) => setProfileData(prev => ({ ...prev, departamento: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senha-atual">Senha Atual</Label>
                <Input id="senha-atual" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <Input id="nova-senha" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                  <Input id="confirmar-senha" type="password" />
                </div>
              </div>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('profile')} disabled={saving}>
              {saving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações por Email</CardTitle>
              <CardDescription>
                Configure quando você deseja receber notificações por email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Campanhas</Label>
                  <p className="text-sm text-gray-600">Notificações sobre status de campanhas</p>
                </div>
                <Switch
                  checked={notificationSettings.emailCampanhas}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailCampanhas: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios</Label>
                  <p className="text-sm text-gray-600">Relatórios automáticos do sistema</p>
                </div>
                <Switch
                  checked={notificationSettings.emailRelatorios}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailRelatorios: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Erros do Sistema</Label>
                  <p className="text-sm text-gray-600">Alertas sobre erros críticos</p>
                </div>
                <Switch
                  checked={notificationSettings.emailErros}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailErros: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outras Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS de Alertas</Label>
                  <p className="text-sm text-gray-600">Alertas críticos via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsAlertas}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, smsAlertas: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Notificações no navegador</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequência de Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={notificationSettings.frequenciaRelatorios} 
                onValueChange={(value) => 
                  setNotificationSettings(prev => ({ ...prev, frequenciaRelatorios: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="nunca">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('notifications')} disabled={saving}>
              {saving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Limites do Sistema</CardTitle>
              <CardDescription>
                Configure os limites operacionais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="limite-mensagens">Limite de Mensagens por Dia</Label>
                  <Input
                    id="limite-mensagens"
                    type="number"
                    value={systemSettings.limiteMensagensDia}
                    onChange={(e) => setSystemSettings(prev => ({ 
                      ...prev, 
                      limiteMensagensDia: parseInt(e.target.value) 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="limite-contatos">Limite de Contatos</Label>
                  <Input
                    id="limite-contatos"
                    type="number"
                    value={systemSettings.limiteContatos}
                    onChange={(e) => setSystemSettings(prev => ({ 
                      ...prev, 
                      limiteContatos: parseInt(e.target.value) 
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup e Retenção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Automático</Label>
                  <p className="text-sm text-gray-600">Realizar backup automático dos dados</p>
                </div>
                <Switch
                  checked={systemSettings.backupAutomatico}
                  onCheckedChange={(checked) => 
                    setSystemSettings(prev => ({ ...prev, backupAutomatico: checked }))
                  }
                />
              </div>
              
              {systemSettings.backupAutomatico && (
                <div>
                  <Label>Frequência do Backup</Label>
                  <Select 
                    value={systemSettings.frequenciaBackup} 
                    onValueChange={(value) => 
                      setSystemSettings(prev => ({ ...prev, frequenciaBackup: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="retencao-dados">Retenção de Dados (dias)</Label>
                <Input
                  id="retencao-dados"
                  type="number"
                  value={systemSettings.retencaoDados}
                  onChange={(e) => setSystemSettings(prev => ({ 
                    ...prev, 
                    retencaoDados: e.target.value 
                  }))}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Dados mais antigos que este período serão automaticamente removidos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Nível de Log</Label>
                <Select 
                  value={systemSettings.logLevel} 
                  onValueChange={(value) => 
                    setSystemSettings(prev => ({ ...prev, logLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('system')} disabled={saving}>
              {saving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>

        {/* APIs */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provedores de Serviço</CardTitle>
              <CardDescription>
                Configure os provedores de SMS, Email e WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Provedor SMS</Label>
                  <Select 
                    value={apiSettings.smsProvider} 
                    onValueChange={(value) => 
                      setApiSettings(prev => ({ ...prev, smsProvider: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Provedor Email</Label>
                  <Select 
                    value={apiSettings.emailProvider} 
                    onValueChange={(value) => 
                      setApiSettings(prev => ({ ...prev, emailProvider: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="aws-ses">AWS SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Provedor WhatsApp</Label>
                  <Select 
                    value={apiSettings.whatsappProvider} 
                    onValueChange={(value) => 
                      setApiSettings(prev => ({ ...prev, whatsappProvider: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="whatsapp-business">WhatsApp Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rate-limit">Rate Limit (requisições por minuto)</Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={apiSettings.rateLimitRpm}
                    onChange={(e) => setApiSettings(prev => ({ 
                      ...prev, 
                      rateLimitRpm: parseInt(e.target.value) 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (segundos)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={apiSettings.timeoutSegundos}
                    onChange={(e) => setApiSettings(prev => ({ 
                      ...prev, 
                      timeoutSegundos: parseInt(e.target.value) 
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status das APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>SMS API</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email API</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>WhatsApp API</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Instável
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('api')} disabled={saving}>
              {saving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings

