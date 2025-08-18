// Dados mocados para demonstração do Sistema Alerta Cidadão

export const mockCampaigns = [
  {
    id: 1,
    nome: "Vacinação COVID-19 - 5ª Dose",
    objetivo: "Informar sobre a disponibilidade da 5ª dose da vacina COVID-19",
    segmento: "Idosos 60+",
    status: "Ativa",
    criacao: "2024-01-15",
    envios: 2340,
    entregues: 2298,
    lidas: 1876,
    pendentes: 42,
    optout: 12,
    categoria: "Informativo"
  },
  {
    id: 2,
    nome: "Alerta Dengue - Prevenção",
    objetivo: "Orientações sobre prevenção da dengue no período chuvoso",
    segmento: "Todos os bairros",
    status: "Concluída",
    criacao: "2024-01-10",
    envios: 5670,
    entregues: 5612,
    lidas: 4234,
    pendentes: 0,
    optout: 58,
    categoria: "Aviso Urgente"
  },
  {
    id: 3,
    nome: "Coleta Seletiva - Novo Cronograma",
    objetivo: "Divulgação do novo cronograma de coleta seletiva",
    segmento: "Região Central",
    status: "Agendada",
    criacao: "2024-01-20",
    envios: 0,
    entregues: 0,
    lidas: 0,
    pendentes: 0,
    optout: 0,
    categoria: "Utilitária"
  },
  {
    id: 4,
    nome: "Cadastro Único - Atualização",
    objetivo: "Lembrete para atualização do Cadastro Único",
    segmento: "Beneficiários CadÚnico",
    status: "Em aprovação",
    criacao: "2024-01-18",
    envios: 0,
    entregues: 0,
    lidas: 0,
    pendentes: 0,
    optout: 0,
    categoria: "Informativo"
  },
  {
    id: 5,
    nome: "Festival de Inverno 2024",
    objetivo: "Divulgação da programação do Festival de Inverno",
    segmento: "Jovens 18-35",
    status: "Ativa",
    criacao: "2024-01-12",
    envios: 3200,
    entregues: 3156,
    lidas: 2890,
    pendentes: 44,
    optout: 23,
    categoria: "Marketing"
  },
  {
    id: 6,
    nome: "Obras Av. Brasil - Interdição",
    objetivo: "Informar sobre interdição temporária na Av. Brasil",
    segmento: "Região Sul",
    status: "Ativa",
    criacao: "2024-01-22",
    envios: 1800,
    entregues: 1785,
    lidas: 1456,
    pendentes: 15,
    optout: 8,
    categoria: "Aviso Urgente"
  }
];

export const mockContacts = [
  {
    id: 1,
    nome: "Maria Silva Santos",
    telefone: "(19) 99876-5432",
    bairro: "Cambuí",
    status: "Ativo",
    tags: ["Idoso", "Vacinação"],
    ultimaInteracao: "2024-01-20"
  },
  {
    id: 2,
    nome: "João Carlos Oliveira",
    telefone: "(19) 98765-4321",
    bairro: "Centro",
    status: "Ativo",
    tags: ["Comerciante", "Eventos"],
    ultimaInteracao: "2024-01-18"
  },
  {
    id: 3,
    nome: "Ana Paula Costa",
    telefone: "(19) 97654-3210",
    bairro: "Jardim Guanabara",
    status: "Inativo",
    tags: ["Jovem", "Cultura"],
    ultimaInteracao: "2024-01-10"
  },
  {
    id: 4,
    nome: "Carlos Eduardo Lima",
    telefone: "(19) 96543-2109",
    bairro: "Vila Industrial",
    status: "Ativo",
    tags: ["Trabalhador", "Transporte"],
    ultimaInteracao: "2024-01-22"
  },
  {
    id: 5,
    nome: "Fernanda Rodrigues",
    telefone: "(19) 95432-1098",
    bairro: "Barão Geraldo",
    status: "Opt-out",
    tags: ["Estudante", "Universidade"],
    ultimaInteracao: "2024-01-05"
  },
  {
    id: 6,
    nome: "Roberto Almeida",
    telefone: "(19) 94321-0987",
    bairro: "Jardim Chapadão",
    status: "Ativo",
    tags: ["Aposentado", "Saúde"],
    ultimaInteracao: "2024-01-21"
  },
  {
    id: 7,
    nome: "Luciana Pereira",
    telefone: "(19) 93210-9876",
    bairro: "Nova Campinas",
    status: "Ativo",
    tags: ["Mãe", "Educação"],
    ultimaInteracao: "2024-01-19"
  },
  {
    id: 8,
    nome: "Marcos Vinícius",
    telefone: "(19) 92109-8765",
    bairro: "Jardim Proença",
    status: "Ativo",
    tags: ["Jovem", "Esportes"],
    ultimaInteracao: "2024-01-17"
  }
];

export const mockDashboardStats = {
  mensagensEnviadas: 42150,
  usuariosAtivos: 8432,
  taxaEntrega: 98.5,
  campanhasAtivas: 23,
  crescimentoMensal: {
    mensagens: 12,
    usuarios: 8,
    entrega: 2,
    campanhas: 5
  }
};

export const mockRecentCampaigns = [
  {
    nome: "Vacinação COVID-19",
    envios: 2340,
    entregues: 2298,
    status: "Ativa"
  },
  {
    nome: "Coleta Seletiva",
    envios: 5670,
    entregues: 5612,
    status: "Concluída"
  },
  {
    nome: "Obras na Av. Brasil",
    envios: 0,
    entregues: 0,
    status: "Agendada"
  }
];

export const mockReports = [
  {
    id: 1,
    titulo: "Relatório Mensal - Janeiro 2024",
    tipo: "Mensal",
    periodo: "Janeiro 2024",
    campanhas: 15,
    mensagens: 45230,
    taxaEntrega: 97.8,
    geradoEm: "2024-02-01"
  },
  {
    id: 2,
    titulo: "Análise de Engajamento - Vacinação",
    tipo: "Campanha",
    periodo: "15-22 Jan 2024",
    campanhas: 1,
    mensagens: 2340,
    taxaEntrega: 98.2,
    geradoEm: "2024-01-23"
  },
  {
    id: 3,
    titulo: "Relatório Semanal - Semana 3",
    tipo: "Semanal",
    periodo: "15-21 Jan 2024",
    campanhas: 4,
    mensagens: 12450,
    taxaEntrega: 96.5,
    geradoEm: "2024-01-22"
  }
];

