# Sistema Alerta Cidadão - Guia de Integração Completo

**Versão:** 1.0  
**Data:** 15 de Agosto de 2025  
**Autor:** Rodolfo Santana 
**Projeto:** Sistema Alerta Cidadão - Prefeitura de Campinas  

## Visão Geral

Este documento serve como um guia completo para integrar as novas funcionalidades e melhorias desenvolvidas para o Sistema Alerta Cidadão. Ele abrange tanto as atualizações do backend (Django) quanto do frontend (React), incluindo o sistema "Compartilha-e-Cresce", funcionalidades LGPD, e melhorias gerais.

Siga este guia passo a passo para garantir uma integração suave e o funcionamento correto de todas as novas funcionalidades.

## Estrutura do Projeto

Seu projeto deve ter uma estrutura similar a esta:

```
. (raiz do projeto)
├── alerta_cidadao_backend/  # Diretório do backend Django
├── sistema-alerta-cidadao-completo/ # Diretório do frontend React
├── INSTRUCOES_COMPLETAS.md
├── README.md
└── RELATORIO_FINAL_MELHORIAS.md
```

As instruções abaixo pressupõem que você está na raiz do seu projeto (`/home/ubuntu/alerta-cidadao/` no meu ambiente, ou o diretório que contém `alerta_cidadao_backend` e `sistema-alerta-cidadao-completo`).

## Pré-requisitos

Antes de iniciar a integração, certifique-se de que você tem:

- [ ] Acesso administrativo ao servidor Django (para o backend)
- [ ] Acesso ao banco de dados PostgreSQL (ou outro DB configurado para Django)
- [ ] Ambiente de desenvolvimento Python/Django configurado
- [ ] Ambiente de desenvolvimento Node.js/React configurado
- [ ] **Backup completo do seu projeto atual** (código e banco de dados) antes de fazer qualquer alteração.

## Etapa 1: Preparação dos Arquivos

Você recebeu dois pacotes ZIP com as atualizações:

1.  `alerta-cidadao-frontend-updates.zip`
2.  `alerta-cidadao-backend-updates.zip`

Descompacte ambos os arquivos em um local temporário. Por exemplo, se você descompactar na sua pasta de downloads, terá estruturas como:

```
/caminho/para/downloads/
├── alerta-cidadao-frontend-updates/
│   ├── App.jsx
│   ├── CampaignDetails.jsx
│   ├── CampaignLanding.jsx
│   ├── ContactImport.jsx
│   ├── Dashboard.jsx
│   ├── Layout.jsx
│   ├── NotificationSystem.jsx
│   ├── OptOutPage.jsx
│   ├── ReferralLinkGenerator.jsx
│   └── ReferralMetrics.jsx
│
└── alerta-cidadao-backend-updates/
    ├── generate_campaign_links.py
    ├── models.py
    ├── token_utils.py
    └── views.py
```

## Etapa 2: Integração do Backend (Django)

Esta seção detalha como integrar as atualizações do backend no seu projeto Django.

### 2.1 Copiar os Novos Arquivos do Backend

1.  **Crie o diretório `utils`** dentro de `alerta_cidadao_backend` se ele não existir:
    ```bash
    mkdir -p alerta_cidadao_backend/utils
    touch alerta_cidadao_backend/utils/__init__.py
    ```

2.  **Copie o arquivo `token_utils.py`** do seu pacote `alerta-cidadao-backend-updates/` para `alerta_cidadao_backend/utils/token_utils.py`.

3.  **Crie a estrutura de diretórios `management/commands`** dentro de `alerta_cidadao_backend` se ela não existir:
    ```bash
    mkdir -p alerta_cidadao_backend/management/commands
    touch alerta_cidadao_backend/management/__init__.py
    touch alerta_cidadao_backend/management/commands/__init__.py
    ```

4.  **Copie o arquivo `generate_campaign_links.py`** do seu pacote `alerta-cidadao-backend-updates/` para `alerta_cidadao_backend/management/commands/generate_campaign_links.py`.

### 2.2 Substituir ou Integrar os Arquivos Atualizados do Backend

**Atenção:** Faça um backup dos seus arquivos `models.py` e `views.py` antes de prosseguir. Se você tiver customizações nesses arquivos, é **altamente recomendável integrar as mudanças manualmente** para evitar a perda de código existente.

1.  **`alerta_cidadao_backend/models.py`**:
    *   **Recomendado:** Compare o `models.py` fornecido no pacote `alerta-cidadao-backend-updates/` com o seu `alerta_cidadao_backend/models.py` e **integre manualmente** as novas definições de modelo (`Contact`, `ReferralLink`, `ReferralTree`, `Event`, `CampaignMetrics`) e quaisquer campos adicionais nos modelos existentes.
    *   **Alternativa (se não houver customizações e você tiver certeza):** Substitua o seu `alerta_cidadao_backend/models.py` pelo arquivo fornecido.

2.  **`alerta_cidadao_backend/views.py`**:
    *   **Recomendado:** Compare o `views.py` fornecido no pacote `alerta-cidadao-backend-updates/` com o seu `alerta_cidadao_backend/views.py` e **integre manualmente** as novas funções de view (`referral_redirect`, `campaign_landing`, `optout_page`, `api_optin`, `api_share`, `api_optout`, `api_campaign_metrics`).
    *   **Alternativa (se não houver customizações e você tiver certeza):** Substitua o seu `alerta_cidadao_backend/views.py` pelo arquivo fornecido.

### 2.3 Executar Migrações do Banco de Dados

Após atualizar o `models.py`, você precisará criar e aplicar as migrações para que as novas tabelas e campos sejam criados no seu banco de dados:

1.  Navegue até o diretório raiz do seu projeto Django (`alerta_cidadao_backend`).
2.  Execute os comandos:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
3.  Verifique se as novas tabelas (`referral_links`, `referral_trees`, `events`, `campaign_metrics`) foram criadas no seu banco de dados.

### 2.4 Atualizar `urls.py`

Você precisará adicionar as novas rotas ao arquivo `alerta_cidadao_backend/urls.py` para que os novos endpoints sejam acessíveis. Adicione as seguintes linhas ao seu `urlpatterns`:

```python
# Em alerta_cidadao_backend/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    # Existing routes...
    
    # New referral routes
    path("r/<str:token>/", views.referral_redirect, name="referral_redirect"),
    path("c/<slug:slug>/", views.campaign_landing, name="campaign_landing"),
    path("optout/", views.optout_page, name="optout_page"),
    
    # API endpoints
    path("api/optin/", views.api_optin, name="api_optin"),
    path("api/share/", views.api_share, name="api_share"),
    path("api/optout/", views.api_optout, name="api_optout"),
    path("api/campaigns/<int:campaign_id>/metrics/", views.api_campaign_metrics, name="api_campaign_metrics"),
    
    # Admin routes (se aplicável)
    # path("admin/", admin.site.urls),
    # path("", include("main_app.urls")),
]
```

### 2.5 Configurar `settings.py`

Adicione as seguintes configurações ao seu arquivo `alerta_cidadao_backend/settings.py`. É recomendável usar variáveis de ambiente para chaves secretas e URLs de produção.

```python
import os

# Referral system settings
REFERRAL_SECRET_KEY = os.environ.get("REFERRAL_SECRET_KEY", SECRET_KEY) # Use SECRET_KEY do Django como fallback
SITE_URL = os.environ.get("SITE_URL", "http://localhost:3000") # URL do seu frontend
PRIVACY_POLICY_URL = os.environ.get("PRIVACY_POLICY_URL", "/privacy") # URL da sua política de privacidade

# LGPD compliance
CONSENT_TEXT_VERSION = "1.0"
DATA_RETENTION_DAYS = 2555  # 7 anos conforme legislação brasileira

# Performance settings
REFERRAL_METRICS_CACHE_TIMEOUT = 300  # 5 minutos para cache de métricas
MAX_TREE_DEPTH = 10  # Previne recursão infinita na árvore de referência

# Configuração de CORS (se o frontend estiver em um domínio diferente)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Adicione o domínio do seu frontend aqui
    # Adicione outros domínios de produção, se houver
]
CORS_ALLOW_CREDENTIALS = True

# Adicione 'rest_framework' e 'corsheaders' aos INSTALLED_APPS se ainda não estiverem
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    # ...
]

# Adicione 'corsheaders.middleware.CorsMiddleware' ao MIDDLEWARE
MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]
```

### 2.6 Instalar Dependências do Backend (se necessário)

Certifique-se de que as seguintes dependências estão instaladas no seu ambiente virtual Django. Navegue até o diretório `alerta_cidadao_backend` e execute:

```bash
pip install djangorestframework django-cors-headers
```

## Etapa 3: Integração do Frontend (React)

Esta seção detalha como integrar as atualizações do frontend no seu projeto React.

### 3.1 Copiar os Novos e Atualizados Arquivos do Frontend

1.  **Navegue para o diretório do frontend:**
    ```bash
    cd sistema-alerta-cidadao-completo/
    ```

2.  **Copie os novos e atualizados componentes** do seu pacote `alerta-cidadao-frontend-updates/` para a pasta `src/components/` do seu projeto React. Substitua os arquivos existentes pelos novos:
    *   `src/components/CampaignDetails.jsx`
    *   `src/components/ContactImport.jsx`
    *   `src/components/Settings.jsx`
    *   `src/components/NotificationSystem.jsx`
    *   `src/components/CampaignLanding.jsx`
    *   `src/components/OptOutPage.jsx`
    *   `src/components/ReferralLinkGenerator.jsx`
    *   `src/components/ReferralMetrics.jsx`
    *   `src/components/Dashboard.jsx`
    *   `src/components/Layout.jsx`
    *   `src/components/Campanhas.jsx`
    *   `src/components/Contatos.jsx`

3.  **Copie o arquivo `App.jsx`** do seu pacote `alerta-cidadao-frontend-updates/` para a pasta `src/` do seu projeto React. Substitua o arquivo existente:
    *   `src/App.jsx`

### 3.2 Verificar e Instalar Dependências do Frontend (se necessário)

Certifique-se de que as seguintes dependências estão instaladas no seu projeto React. Navegue até o diretório `sistema-alerta-cidadao-completo` e execute:

```bash
npm install recharts @radix-ui/react-progress lucide-react
# ou, se você usa yarn:
yarn add recharts @radix-ui/react-progress lucide-react
```

### 3.3 Ajustes Manuais no Frontend (se necessário)

Dependendo de como seu projeto React evoluiu, pode ser necessário fazer pequenos ajustes manuais:

*   **Importações:** Verifique se todos os `import` statements nos arquivos `.jsx` estão corretos e apontam para os caminhos certos dentro da sua estrutura de pastas.
*   **Estilos:** As novas páginas e componentes utilizam `shadcn/ui` e `Tailwind CSS`. Certifique-se de que seu projeto está configurado para usar Tailwind CSS e que os estilos estão sendo aplicados corretamente. Se você estiver usando uma versão diferente do `shadcn/ui` ou tiver personalizações, pode ser necessário ajustar as classes de estilo.

## Etapa 4: Testes de Funcionalidade

Após a integração de ambos os lados (backend e frontend), é fundamental testar as novas funcionalidades.

### 4.1 Teste do Backend

1.  **Inicie o servidor Django:**
    Navegue até o diretório `alerta_cidadao_backend` e execute:
    ```bash
    python manage.py runserver
    ```

2.  **Teste a geração de links:**
    *   Crie uma campanha de teste no seu admin Django.
    *   Crie um arquivo CSV simples (ex: `contatos.csv`):
        ```csv
        name,phone
        Joao Silva,+5511987654321
        Maria Souza,+5521912345678
        ```
    *   Execute o comando de gestão (substitua `CAMPAIGN_ID` pelo ID da sua campanha de teste):
        ```bash
        python manage.py generate_campaign_links --campaign CAMPAIGN_ID --csv-file contatos.csv
        ```
    *   Verifique no seu banco de dados se os `ReferralLink` foram criados.

3.  **Teste o redirecionamento de links:**
    *   Pegue um `signed_token` gerado e tente acessá-lo no navegador (ex: `http://localhost:8000/r/<seu_token>/`). Ele deve redirecionar para a landing page (`/c/<slug_da_campanha>/?t=<seu_token>`).

4.  **Teste o opt-in na landing page:**
    *   Acesse a landing page (ex: `http://localhost:3000/c/slug-da-campanha/?t=<seu_token>`).
    *   Preencha o formulário e envie. Verifique se um novo `Contact` e `ReferralTree` foram criados no banco de dados e se um `Event` de `optin` foi registrado.

5.  **Teste as APIs de métricas:**
    *   Acesse o endpoint de métricas (ex: `http://localhost:8000/api/campaigns/<CAMPAIGN_ID>/metrics/`). Você deve ver os dados de cliques, opt-ins, etc.

### 4.2 Teste do Frontend

1.  **Inicie o servidor React:**
    Navegue até o diretório `sistema-alerta-cidadao-completo` e execute:
    ```bash
    npm start
    ```

2.  **Verifique se as páginas carregam:**
    *   Dashboard: `http://localhost:3000/dashboard`
    *   Gerar Links: `http://localhost:3000/links`
    *   Landing Page: `http://localhost:3000/c/test-campaign` (esta página depende do backend)
    *   Opt-out: `http://localhost:3000/optout` (esta página depende do backend)

3.  **Teste a navegação entre páginas** e as novas funcionalidades visuais.

## Etapa 5: Configuração de Produção (Opcional, mas recomendado)

Para um ambiente de produção, considere as seguintes configurações:

### 5.1 Configurar Nginx (ou outro proxy reverso)

Se você usa Nginx, adicione configurações para as novas rotas do backend. Exemplo em `/etc/nginx/sites-available/alerta-cidadao`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;
    
    # Existing configuration...
    
    # New referral routes (proxy para o backend Django)
    location /r/ {
        proxy_pass http://127.0.0.1:8000; # Ou o endereço do seu servidor Django
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /c/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /optout {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Configuração para o frontend React (servir arquivos estáticos)
    location / {
        root /caminho/para/seu/sistema-alerta-cidadao-completo/build; # Caminho para a pasta build do React
        try_files $uri /index.html;
    }
}
```

Após configurar, recarregue o Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 Configurar Variáveis de Ambiente

Defina as variáveis de ambiente para o seu ambiente de produção. Por exemplo, em um arquivo `.env` ou nas configurações do seu servidor:

```bash
export REFERRAL_SECRET_KEY="SUA_CHAVE_SECRETA_UNICA_E_FORTE_AQUI"
export SITE_URL="https://seu-dominio.com.br"
export PRIVACY_POLICY_URL="https://seu-dominio.com.br/politica-de-privacidade"
```

Lembre-se de que `REFERRAL_SECRET_KEY` deve ser uma chave forte e única, diferente da `SECRET_KEY` principal do Django.

### 5.3 Configurar SSL

Se você estiver usando Certbot, atualize seus certificados para incluir os novos subdomínios ou caminhos, se aplicável:

```bash
sudo certbot --nginx -d seu-dominio.com.br
```

## Suporte e Dúvidas

Se você tiver alguma dúvida ou encontrar problemas durante a integração, por favor, me avise. Estou à disposição para ajudar a garantir o sucesso da sua implementação.


# alerta-cidadao
