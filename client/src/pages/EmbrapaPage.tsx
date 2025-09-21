import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocalFlorist as EcoIcon,
  WaterDrop as WaterIcon,
  Science as ScienceIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';
import { embrapaApi } from '../services/api';
import { EmbrapaRecommendation } from '../types';

export const EmbrapaPage: React.FC = () => {
  const [selectedCulture, setSelectedCulture] = useState('');
  const [recommendations, setRecommendations] = useState<EmbrapaRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cultureOptions = ['Feijão', 'Milho', 'Capim', 'Sorgo', 'Manga', 'Acerola', 'Uva'];

  const fetchRecommendations = async (culture: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await embrapaApi.getRecommendations(culture);
      setRecommendations(response.data);
    } catch (err: any) {
      setError('Erro ao buscar recomendações da EMBRAPA');
      console.error('EMBRAPA error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCultureChange = (culture: string) => {
    setSelectedCulture(culture);
    if (culture) {
      fetchRecommendations(culture);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recomendações EMBRAPA com IA
      </Typography>
      
      <Typography variant="body1" paragraph>
        Obtenha recomendações especializadas da EMBRAPA para suas culturas, 
        incluindo boas práticas agrícolas, manejo de água, solo e adubagem.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Selecione a Cultura</InputLabel>
          <Select
            value={selectedCulture}
            label="Selecione a Cultura"
            onChange={(e) => handleCultureChange(e.target.value)}
          >
            {cultureOptions.map((culture) => (
              <MenuItem key={culture} value={culture}>
                {culture}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {recommendations && !loading && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
            {/* Boas Práticas */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EcoIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Boas Práticas Agrícolas
                  </Typography>
                </Box>
                <List dense>
                  {recommendations.recommendations.bestPractices.map((practice, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={practice} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Irrigação */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <WaterIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Manejo de Irrigação
                  </Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Frequência:</strong> {recommendations.recommendations.irrigation.frequency}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Quantidade:</strong> {recommendations.recommendations.irrigation.amount}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Períodos Críticos:</strong>
                </Typography>
                <List dense>
                  {recommendations.recommendations.irrigation.criticalPeriods.map((period, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={period} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Adubação */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ScienceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Recomendações de Adubação
                  </Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Nitrogênio (N):</strong> {recommendations.recommendations.fertilization.nitrogen}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Fósforo (P₂O₅):</strong> {recommendations.recommendations.fertilization.phosphorus}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Potássio (K₂O):</strong> {recommendations.recommendations.fertilization.potassium}
                </Typography>
              </CardContent>
            </Card>

            {/* Doenças e Pragas */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <BugIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Controle de Doenças e Pragas
                  </Typography>
                </Box>
                <List dense>
                  {recommendations.recommendations.diseases.map((disease, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={disease} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Informações da Fonte */}
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mt: 3 }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Fonte:</strong> {recommendations.source} | 
              <strong> Última Atualização:</strong> {new Date(recommendations.lastUpdated).toLocaleDateString('pt-BR')}
            </Typography>
          </Paper>
        </>
      )}

      {!selectedCulture && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" color="textSecondary">
            Selecione uma cultura para ver as recomendações da EMBRAPA
          </Typography>
        </Paper>
      )}
    </Box>
  );
};