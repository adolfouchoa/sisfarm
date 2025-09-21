export interface Culture {
  _id: string;
  name: 'Feijão' | 'Milho' | 'Capim' | 'Sorgo' | 'Manga' | 'Acerola' | 'Uva';
  area: number;
  coordinates: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  plantingDate: string;
  expectedHarvestDate?: string;
  variety: string;
  stage: 'Plantio' | 'Crescimento' | 'Floração' | 'Frutificação' | 'Colheita';
  healthStatus: 'Excelente' | 'Bom' | 'Regular' | 'Ruim' | 'Crítico';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Input {
  _id: string;
  cultureId: string;
  type: 'Fertilizante' | 'Defensivo' | 'Sementes' | 'Irrigação' | 'Mão de obra' | 'Maquinário' | 'Outros';
  name: string;
  description?: string;
  quantity: number;
  unit: 'kg' | 'L' | 'ton' | 'sacos' | 'horas' | 'dias' | 'unidades';
  costPerUnit: number;
  totalCost: number;
  supplier?: {
    name: string;
    contact?: string;
    phone?: string;
  };
  applicationDate: string;
  applicationMethod?: 'Manual' | 'Pulverização' | 'Irrigação' | 'Incorporação ao solo' | 'Outros';
  weather?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    conditions?: string;
  };
  responsible: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  farmName: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface DashboardOverview {
  summary: {
    totalCultures: number;
    totalArea: number;
    totalInputs: number;
    averageHealthScore: number;
  };
  recentActivity: Input[];
  cultureDistribution: {
    _id: string;
    count: number;
    area: number;
  }[];
  monthlyExpenses: {
    month: string;
    amount: number;
    count: number;
  }[];
  healthStatus: {
    _id: string;
    count: number;
  }[];
}

export interface EmbrapaRecommendation {
  culture: string;
  recommendations: {
    bestPractices: string[];
    fertilization: {
      nitrogen: string;
      phosphorus: string;
      potassium: string;
    };
    irrigation: {
      frequency: string;
      amount: string;
      criticalPeriods: string[];
    };
    diseases: string[];
  };
  source: string;
  lastUpdated: string;
}