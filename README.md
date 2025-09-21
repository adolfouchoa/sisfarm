# SisFarm - Sistema de Gerenciamento de Fazenda de Plantações

Um sistema completo para gerenciamento de plantações com integração de IA e dados da EMBRAPA.

## 🌱 Características

- **Mapeamento de Culturas**: Divisão da fazenda em áreas específicas para diferentes culturas
- **Dashboard Interativo**: Visualização completa da situação da fazenda
- **Gestão de Insumos**: Controle detalhado de todos os insumos aplicados
- **Integração EMBRAPA**: Recomendações baseadas em dados científicos
- **Mapa Interativo**: Visualização geográfica das culturas
- **Relatórios e Análises**: Dashboards com métricas importantes

## 🚀 Culturas Suportadas

- Feijão
- Milho  
- Capim
- Sorgo
- Manga
- Acerola
- Uva

## 🛠️ Tecnologias

### Backend
- **Node.js** com Express
- **MongoDB** com Mongoose
- **JWT** para autenticação
- Integração com APIs da EMBRAPA

### Frontend
- **React** com TypeScript
- **Material-UI** para componentes
- **Leaflet** para mapas interativos
- **Recharts** para gráficos e dashboards

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/adolfouchoa/sisfarm.git
cd sisfarm
```

### 2. Instalar dependências
```bash
npm run install:all
```

### 3. Configurar variáveis de ambiente

#### Backend (server/.env)
```bash
cp server/.env.example server/.env
```
Edite o arquivo `server/.env` com suas configurações:
- URL do MongoDB
- Chave secreta JWT
- Configurações da API EMBRAPA

#### Frontend (client/.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Executar o projeto

#### Desenvolvimento (executa backend e frontend simultaneamente)
```bash
npm run dev
```

#### Somente backend
```bash
npm run server:dev
```

#### Somente frontend
```bash
npm run client:dev
```

### 5. Produção
```bash
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
sisfarm/
├── server/                 # Backend API
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Rotas da API
│   ├── controllers/       # Lógica de negócio
│   ├── middleware/        # Middlewares
│   ├── services/          # Serviços externos
│   └── config/            # Configurações
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Integração com API
│   │   └── types/         # Tipos TypeScript
├── docs/                  # Documentação
└── README.md
```

## 🔌 API Endpoints

### Culturas
- `GET /api/cultures` - Listar culturas
- `POST /api/cultures` - Criar cultura
- `PUT /api/cultures/:id` - Atualizar cultura
- `DELETE /api/cultures/:id` - Excluir cultura

### Insumos
- `GET /api/inputs` - Listar insumos
- `POST /api/inputs` - Registrar insumo
- `GET /api/inputs/stats/costs` - Estatísticas de custos

### Dashboard
- `GET /api/dashboard/overview` - Visão geral
- `GET /api/dashboard/alerts` - Alertas do sistema

### EMBRAPA
- `GET /api/embrapa/recommendations/:culture` - Recomendações
- `GET /api/embrapa/weather` - Dados meteorológicos
- `GET /api/embrapa/soil-analysis` - Análise de solo

## 🎯 Funcionalidades Principais

### 1. Dashboard
- Visão geral da fazenda
- Métricas importantes
- Gráficos de performance
- Alertas e notificações

### 2. Gestão de Culturas
- Cadastro de culturas
- Acompanhamento de estágios
- Status de saúde
- Previsões de colheita

### 3. Controle de Insumos
- Registro de aplicações
- Controle de custos
- Histórico por cultura
- Relatórios financeiros

### 4. Mapa Interativo
- Visualização das áreas
- Coordenadas GPS
- Delimitação de culturas
- Análise espacial

### 5. Integração EMBRAPA
- Recomendações técnicas
- Dados meteorológicos
- Análise de solo com IA
- Boas práticas agrícolas

## 🔒 Segurança

- Autenticação JWT
- Controle de acesso por roles
- Validação de dados
- Sanitização de inputs

## 📈 Futuras Melhorias

- [ ] Integração com sensores IoT
- [ ] Aplicativo mobile
- [ ] Relatórios em PDF
- [ ] Integração com sistemas de pagamento
- [ ] Machine Learning para previsões
- [ ] API para terceiros

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença Apache 2.0. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do GitHub Issues ou email.

---

⭐ Se este projeto foi útil, considere dar uma estrela!
