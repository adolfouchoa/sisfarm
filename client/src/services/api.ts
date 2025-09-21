import axios from 'axios';
import { Culture, Input, DashboardOverview, EmbrapaRecommendation } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cultures API
export const culturesApi = {
  getAll: () => api.get<Culture[]>('/cultures'),
  getById: (id: string) => api.get<Culture>(`/cultures/${id}`),
  create: (data: Partial<Culture>) => api.post<Culture>('/cultures', data),
  update: (id: string, data: Partial<Culture>) => api.put<Culture>(`/cultures/${id}`, data),
  delete: (id: string) => api.delete(`/cultures/${id}`),
  getStats: () => api.get('/cultures/stats/summary'),
};

// Inputs API
export const inputsApi = {
  getAll: (params?: { cultureId?: string; type?: string; startDate?: string; endDate?: string }) => 
    api.get<Input[]>('/inputs', { params }),
  getById: (id: string) => api.get<Input>(`/inputs/${id}`),
  create: (data: Partial<Input>) => api.post<Input>('/inputs', data),
  update: (id: string, data: Partial<Input>) => api.put<Input>(`/inputs/${id}`, data),
  delete: (id: string) => api.delete(`/inputs/${id}`),
  getCostStats: () => api.get('/inputs/stats/costs'),
};

// Maps API
export const mapsApi = {
  getCultureGeoData: () => api.get('/maps/cultures'),
  getCultureById: (id: string) => api.get(`/maps/cultures/${id}`),
  searchByLocation: (data: { longitude: number; latitude: number; maxDistance?: number }) => 
    api.post('/maps/search', data),
  getFarmBoundaries: () => api.get('/maps/boundaries'),
};

// Dashboard API
export const dashboardApi = {
  getOverview: () => api.get<DashboardOverview>('/dashboard/overview'),
  getCulturePerformance: () => api.get('/dashboard/culture-performance'),
  getFinancialSummary: (params?: { startDate?: string; endDate?: string }) => 
    api.get('/dashboard/financial-summary', { params }),
  getAlerts: () => api.get('/dashboard/alerts'),
};

// EMBRAPA API
export const embrapaApi = {
  getRecommendations: (culture: string) => 
    api.get<EmbrapaRecommendation>(`/embrapa/recommendations/${culture}`),
  getWeather: (params?: { lat?: number; lon?: number }) => 
    api.get('/embrapa/weather', { params }),
  getSoilAnalysis: (params?: { culture?: string; soilType?: string; region?: string }) => 
    api.get('/embrapa/soil-analysis', { params }),
  getAIRecommendation: (data: any) => api.post('/embrapa/ai-recommendation', data),
};

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; farmName: string; phone?: string }) => 
    api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;