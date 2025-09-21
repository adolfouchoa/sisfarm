import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { dashboardApi } from '../services/api';
import { DashboardOverview } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getOverview();
        setOverview(response.data);
        setError(null);
      } catch (err: any) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!overview) {
    return (
      <Alert severity="info">
        Nenhum dado disponível para exibição
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard - Visão Geral da Fazenda
      </Typography>

      {/* Cards de Resumo */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total de Culturas
            </Typography>
            <Typography variant="h5" component="div">
              {overview.summary.totalCultures}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Área Total (ha)
            </Typography>
            <Typography variant="h5" component="div">
              {overview.summary.totalArea.toFixed(1)}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total de Insumos
            </Typography>
            <Typography variant="h5" component="div">
              {overview.summary.totalInputs}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Score de Saúde
            </Typography>
            <Typography variant="h5" component="div">
              {overview.summary.averageHealthScore}/5
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3, mb: 3 }}>
        {/* Distribuição das Culturas */}
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Distribuição das Culturas
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overview.cultureDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ _id, count }) => `${_id}: ${count}`}
              >
                {overview.cultureDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Status de Saúde */}
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Status de Saúde das Culturas
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview.healthStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Gastos Mensais */}
      <Paper sx={{ p: 3, height: 400, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gastos Mensais com Insumos
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={overview.monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Atividade Recente */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Atividade Recente
        </Typography>
        {overview.recentActivity.length === 0 ? (
          <Typography color="textSecondary">
            Nenhuma atividade recente registrada
          </Typography>
        ) : (
          <Box>
            {overview.recentActivity.map((input, index) => (
              <Box key={input._id} sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {input.name} - {input.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantidade: {input.quantity} {input.unit} | 
                  Custo: R$ {input.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} |
                  Data: {new Date(input.applicationDate).toLocaleDateString('pt-BR')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};