const express = require('express');
const router = express.Router();
const Culture = require('../models/Culture');

// GET /api/cultures - Listar todas as culturas
router.get('/', async (req, res) => {
  try {
    const cultures = await Culture.find();
    res.json(cultures);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar culturas', error: error.message });
  }
});

// GET /api/cultures/:id - Buscar cultura por ID
router.get('/:id', async (req, res) => {
  try {
    const culture = await Culture.findById(req.params.id);
    if (!culture) {
      return res.status(404).json({ message: 'Cultura não encontrada' });
    }
    res.json(culture);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cultura', error: error.message });
  }
});

// POST /api/cultures - Criar nova cultura
router.post('/', async (req, res) => {
  try {
    const culture = new Culture(req.body);
    await culture.save();
    res.status(201).json(culture);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar cultura', error: error.message });
  }
});

// PUT /api/cultures/:id - Atualizar cultura
router.put('/:id', async (req, res) => {
  try {
    const culture = await Culture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!culture) {
      return res.status(404).json({ message: 'Cultura não encontrada' });
    }
    res.json(culture);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar cultura', error: error.message });
  }
});

// DELETE /api/cultures/:id - Deletar cultura
router.delete('/:id', async (req, res) => {
  try {
    const culture = await Culture.findByIdAndDelete(req.params.id);
    if (!culture) {
      return res.status(404).json({ message: 'Cultura não encontrada' });
    }
    res.json({ message: 'Cultura deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar cultura', error: error.message });
  }
});

// GET /api/cultures/stats/summary - Estatísticas das culturas
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Culture.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          totalArea: { $sum: '$area' },
          avgArea: { $avg: '$area' }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar estatísticas', error: error.message });
  }
});

module.exports = router;