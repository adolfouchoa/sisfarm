import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { culturesApi } from '../services/api';
import { Culture } from '../types';

export const CulturesPage: React.FC = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCulture, setEditingCulture] = useState<Culture | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    variety: '',
    stage: 'Plantio',
    healthStatus: 'Bom',
    plantingDate: '',
    expectedHarvestDate: '',
    notes: '',
  });

  const cultureOptions = ['Feijão', 'Milho', 'Capim', 'Sorgo', 'Manga', 'Acerola', 'Uva'];
  const stageOptions = ['Plantio', 'Crescimento', 'Floração', 'Frutificação', 'Colheita'];
  const healthOptions = ['Excelente', 'Bom', 'Regular', 'Ruim', 'Crítico'];

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchCultures = async () => {
    try {
      setLoading(true);
      const response = await culturesApi.getAll();
      setCultures(response.data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar culturas');
      console.error('Cultures error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (culture?: Culture) => {
    if (culture) {
      setEditingCulture(culture);
      setFormData({
        name: culture.name,
        area: culture.area.toString(),
        variety: culture.variety,
        stage: culture.stage,
        healthStatus: culture.healthStatus,
        plantingDate: culture.plantingDate.split('T')[0],
        expectedHarvestDate: culture.expectedHarvestDate?.split('T')[0] || '',
        notes: culture.notes || '',
      });
    } else {
      setEditingCulture(null);
      setFormData({
        name: '',
        area: '',
        variety: '',
        stage: 'Plantio',
        healthStatus: 'Bom',
        plantingDate: '',
        expectedHarvestDate: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCulture(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        name: formData.name as Culture['name'],
        area: parseFloat(formData.area),
        stage: formData.stage as Culture['stage'],
        healthStatus: formData.healthStatus as Culture['healthStatus'],
        coordinates: {
          type: 'Polygon' as const,
          coordinates: [[[-47.0, -15.0], [-47.0, -15.1], [-47.1, -15.1], [-47.1, -15.0], [-47.0, -15.0]]], // Placeholder coordinates
        },
      };

      if (editingCulture) {
        await culturesApi.update(editingCulture._id, data);
      } else {
        await culturesApi.create(data);
      }

      handleCloseDialog();
      fetchCultures();
    } catch (err: any) {
      setError('Erro ao salvar cultura');
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cultura?')) {
      try {
        await culturesApi.delete(id);
        fetchCultures();
      } catch (err: any) {
        setError('Erro ao excluir cultura');
        console.error('Delete error:', err);
      }
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Excelente': return 'success';
      case 'Bom': return 'primary';
      case 'Regular': return 'warning';
      case 'Ruim': return 'error';
      case 'Crítico': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gerenciamento de Culturas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Cultura
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cultura</TableCell>
              <TableCell>Variedade</TableCell>
              <TableCell>Área (ha)</TableCell>
              <TableCell>Estágio</TableCell>
              <TableCell>Saúde</TableCell>
              <TableCell>Data Plantio</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cultures.map((culture) => (
              <TableRow key={culture._id}>
                <TableCell>{culture.name}</TableCell>
                <TableCell>{culture.variety}</TableCell>
                <TableCell>{culture.area.toFixed(1)}</TableCell>
                <TableCell>{culture.stage}</TableCell>
                <TableCell>
                  <Chip
                    label={culture.healthStatus}
                    color={getHealthColor(culture.healthStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(culture.plantingDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(culture)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(culture._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {cultures.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma cultura cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar cultura */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCulture ? 'Editar Cultura' : 'Nova Cultura'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Cultura</InputLabel>
                <Select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  label="Tipo de Cultura"
                >
                  {cultureOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Variedade"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Área (hectares)"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />

              <FormControl fullWidth>
                <InputLabel>Estágio</InputLabel>
                <Select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  label="Estágio"
                >
                  {stageOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status de Saúde</InputLabel>
                <Select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                  label="Status de Saúde"
                >
                  {healthOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Data do Plantio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Previsão de Colheita"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.expectedHarvestDate}
                onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
              />
            </Box>

            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCulture ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};