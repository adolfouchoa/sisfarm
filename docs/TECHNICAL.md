# Documentação Técnica - SisFarm

## Arquitetura do Sistema

### Visão Geral
O SisFarm é um sistema de gerenciamento de fazendas de plantações que utiliza uma arquitetura moderna dividida em:

- **Frontend**: React com TypeScript
- **Backend**: Node.js com Express
- **Banco de Dados**: MongoDB
- **Integração**: APIs EMBRAPA para IA e recomendações

### Modelos de Dados

#### Culture (Cultura)
```typescript
{
  _id: ObjectId,
  name: 'Feijão' | 'Milho' | 'Capim' | 'Sorgo' | 'Manga' | 'Acerola' | 'Uva',
  area: Number, // hectares
  coordinates: {
    type: 'Polygon',
    coordinates: [[[Number]]] // GeoJSON
  },
  plantingDate: Date,
  expectedHarvestDate: Date,
  variety: String,
  stage: 'Plantio' | 'Crescimento' | 'Floração' | 'Frutificação' | 'Colheita',
  healthStatus: 'Excelente' | 'Bom' | 'Regular' | 'Ruim' | 'Crítico',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Integração EMBRAPA

### Recomendações por Cultura
O sistema simula integração com APIs da EMBRAPA para fornecer:

1. **Boas Práticas Agrícolas**
2. **Manejo de Irrigação**
3. **Adubação**
4. **Controle Fitossanitário**

## Dashboard e Métricas

### Métricas Principais
- **Total de Culturas**: Quantidade de áreas cultivadas
- **Área Total**: Soma das áreas em hectares
- **Total de Insumos**: Quantidade de aplicações registradas
- **Score de Saúde**: Média ponderada do status de saúde

### Gráficos Disponíveis
1. **Distribuição das Culturas** (Pizza)
2. **Status de Saúde** (Barras)
3. **Gastos Mensais** (Linha)
4. **Performance por Cultura** (Barras)

## Deployment

### Desenvolvimento
```bash
# Instalar dependências
npm run install:all

# Executar em modo desenvolvimento
npm run dev
```

### Produção
```bash
# Build do frontend
npm run build

# Iniciar servidor
npm start
```