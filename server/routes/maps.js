const express = require('express');
const router = express.Router();
const Culture = require('../models/Culture');

// GET /api/maps/cultures - Obter dados geoespaciais das culturas para o mapa
router.get('/cultures', async (req, res) => {
  try {
    const cultures = await Culture.find().select('name coordinates area variety stage healthStatus');
    
    // Converter para formato GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: cultures.map(culture => ({
        type: 'Feature',
        properties: {
          id: culture._id,
          name: culture.name,
          area: culture.area,
          variety: culture.variety,
          stage: culture.stage,
          healthStatus: culture.healthStatus
        },
        geometry: culture.coordinates
      }))
    };

    res.json(geoJson);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do mapa', error: error.message });
  }
});

// GET /api/maps/cultures/:id - Obter dados geoespaciais de uma cultura específica
router.get('/cultures/:id', async (req, res) => {
  try {
    const culture = await Culture.findById(req.params.id);
    if (!culture) {
      return res.status(404).json({ message: 'Cultura não encontrada' });
    }

    const geoJson = {
      type: 'Feature',
      properties: {
        id: culture._id,
        name: culture.name,
        area: culture.area,
        variety: culture.variety,
        stage: culture.stage,
        healthStatus: culture.healthStatus,
        plantingDate: culture.plantingDate,
        expectedHarvestDate: culture.expectedHarvestDate,
        notes: culture.notes
      },
      geometry: culture.coordinates
    };

    res.json(geoJson);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados da cultura', error: error.message });
  }
});

// POST /api/maps/search - Buscar culturas por proximidade geográfica
router.post('/search', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 1000 } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude e latitude são obrigatórias' });
    }

    const cultures = await Culture.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      }
    });

    res.json(cultures);
  } catch (error) {
    res.status(500).json({ message: 'Erro na busca geográfica', error: error.message });
  }
});

// GET /api/maps/boundaries - Obter limites da fazenda
router.get('/boundaries', async (req, res) => {
  try {
    const cultures = await Culture.find().select('coordinates');
    
    if (cultures.length === 0) {
      return res.json({ 
        message: 'Nenhuma cultura cadastrada',
        bounds: null 
      });
    }

    // Calcular limites da fazenda baseado nas culturas
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    cultures.forEach(culture => {
      culture.coordinates.coordinates[0].forEach(coord => {
        const [lng, lat] = coord;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    });

    const bounds = {
      southwest: { lat: minLat, lng: minLng },
      northeast: { lat: maxLat, lng: maxLng },
      center: { 
        lat: (minLat + maxLat) / 2, 
        lng: (minLng + maxLng) / 2 
      }
    };

    res.json(bounds);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao calcular limites da fazenda', error: error.message });
  }
});

module.exports = router;