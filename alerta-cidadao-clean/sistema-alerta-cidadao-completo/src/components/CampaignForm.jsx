import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Calendar, 
  Users, 
  MessageSquare, 
  Tag,
  X,
  Plus
} from 'lucide-react'

const CampaignForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    mensagem: '',
    anexos: [],
    dataEnvio: '',
    horaEnvio: '',
    segmentacao: '',
    bairros: [],
    tags: []
  })

  const [novoTag, setNovoTag] = useState('')
  const [novoBairro, setNovoBairro] = useState('')

  const categorias = [
    'Utilitária',
    'Marketing', 
    'Aviso Urgente',
    'Informativo'
  ]

  const bairrosSugeridos = [
    'Cambuí', 'Centro', 'Jardim Guanabara', 'Vila Industrial',
    'Barão Geraldo', 'Jardim Chapadão', 'Nova Campinas', 'Jardim Proença'
  ]

  const tagsSugeridas = [
    'Idoso', 'Jovem', 'Comerciante', 'Estudante', 'Trabalhador',
    'Aposentado', 'Mãe', 'Vacinação', 'Saúde', 'Educação', 'Transporte'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const adicionarTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setNovoTag('')
  }

  const removerTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const adicionarBairro = (bairro) => {
    if (bairro && !formData.bairros.includes(bairro)) {
      setFormData(prev => ({
        ...prev,
        bairros: [...prev.bairros, bairro]
      }))
    }
    setNovoBairro('')
  }

  const removerBairro = (bairroToRemove) => {
    setFormData(prev => ({
      ...prev,
      bairros: prev.bairros.filter(bairro => bairro !== bairroToRemove)
    }))
  }

  const inserirVariavel = (variavel) => {
    const textarea = document.getElementById('mensagem')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.mensagem
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)
    const newText = before + variavel + after
    
    handleInputChange('mensagem', newText)
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variavel.length
      textarea.focus()
    }, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.categoria || !formData.mensagem) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    onSubmit(formData)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      anexos: [...prev.anexos, ...files]
    }))
  }

  const removerAnexo = (index) => {
    setFormData(prev => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Informações Básicas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título da Campanha *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder="Ex: Vacinação COVID-19 - 5ª Dose"
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria *</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mensagem">Mensagem *</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inserirVariavel('[NOME]')}
                >
                  + [NOME]
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inserirVariavel('[BAIRRO]')}
                >
                  + [BAIRRO]
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inserirVariavel('[CIDADE]')}
                >
                  + [CIDADE]
                </Button>
              </div>
              <Textarea
                id="mensagem"
                value={formData.mensagem}
                onChange={(e) => handleInputChange('mensagem', e.target.value)}
                placeholder="Digite sua mensagem aqui. Use as variáveis [NOME], [BAIRRO], [CIDADE] para personalizar."
                rows={4}
                required
              />
              <p className="text-sm text-gray-600">
                Caracteres: {formData.mensagem.length}/1000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anexos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Anexos</span>
          </CardTitle>
          <CardDescription>
            Adicione imagens, vídeos ou documentos (máx. 5MB cada)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            
            {formData.anexos.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos selecionados:</Label>
                {formData.anexos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerAnexo(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Data/Hora de Envio</span>
          </CardTitle>
          <CardDescription>
            Deixe em branco para envio imediato após aprovação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataEnvio">Data</Label>
              <Input
                id="dataEnvio"
                type="date"
                value={formData.dataEnvio}
                onChange={(e) => handleInputChange('dataEnvio', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="horaEnvio">Hora</Label>
              <Input
                id="horaEnvio"
                type="time"
                value={formData.horaEnvio}
                onChange={(e) => handleInputChange('horaEnvio', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segmentação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Segmentação</span>
          </CardTitle>
          <CardDescription>
            Defina quem receberá esta campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="segmentacao">Tipo de Segmentação</Label>
            <Select value={formData.segmentacao} onValueChange={(value) => handleInputChange('segmentacao', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de segmentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os contatos</SelectItem>
                <SelectItem value="bairros">Por bairros</SelectItem>
                <SelectItem value="tags">Por tags</SelectItem>
                <SelectItem value="lista">Lista específica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.segmentacao === 'bairros' && (
            <div>
              <Label>Bairros Selecionados</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={novoBairro} onValueChange={setNovoBairro}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um bairro" />
                    </SelectTrigger>
                    <SelectContent>
                      {bairrosSugeridos.map(bairro => (
                        <SelectItem key={bairro} value={bairro}>
                          {bairro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => adicionarBairro(novoBairro)}
                    disabled={!novoBairro}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.bairros.map(bairro => (
                    <Badge key={bairro} variant="secondary" className="flex items-center gap-1">
                      {bairro}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removerBairro(bairro)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.segmentacao === 'tags' && (
            <div>
              <Label>Tags Selecionadas</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={novoTag} onValueChange={setNovoTag}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione uma tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tagsSugeridas.map(tag => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => adicionarTag(novoTag)}
                    disabled={!novoTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removerTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Criar Campanha
        </Button>
      </div>
    </form>
  )
}

export default CampaignForm

