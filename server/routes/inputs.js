const express = require('express');
const router = express.Router();
const Input = require('../models/Input');
const Culture = require('../models/Culture');

// GET /api/inputs - Listar todos os insumos
router.get('/', async (req, res) => {
  try {
    const { cultureId, type, startDate, endDate } = req.query;
    let filter = {};
    
    if (cultureId) filter.cultureId = cultureId;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.applicationDate = {};
      if (startDate) filter.applicationDate.$gte = new Date(startDate);
      if (endDate) filter.applicationDate.$lte = new Date(endDate);
    }

    const inputs = await Input.find(filter).populate('cultureId', 'name variety');
    res.json(inputs);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar insumos', error: error.message });
  }
});

// GET /api/inputs/:id - Buscar insumo por ID
router.get('/:id', async (req, res) => {
  try {
    const input = await Input.findById(req.params.id).populate('cultureId');
    if (!input) {
      return res.status(404).json({ message: 'Insumo não encontrado' });
    }
    res.json(input);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar insumo', error: error.message });
  }
});

// POST /api/inputs - Criar novo insumo
router.post('/', async (req, res) => {
  try {
    // Verificar se a cultura existe
    const culture = await Culture.findById(req.body.cultureId);
    if (!culture) {
      return res.status(404).json({ message: 'Cultura não encontrada' });
    }

    const input = new Input(req.body);
    await input.save();
    await input.populate('cultureId', 'name variety');
    res.status(201).json(input);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar insumo', error: error.message });
  }
});

// PUT /api/inputs/:id - Atualizar insumo
router.put('/:id', async (req, res) => {
  try {
    const input = await Input.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('cultureId');
    
    if (!input) {
      return res.status(404).json({ message: 'Insumo não encontrado' });
    }
    res.json(input);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar insumo', error: error.message });
  }
});

// DELETE /api/inputs/:id - Deletar insumo
router.delete('/:id', async (req, res) => {
  try {
    const input = await Input.findByIdAndDelete(req.params.id);
    if (!input) {
      return res.status(404).json({ message: 'Insumo não encontrado' });
    }
    res.json({ message: 'Insumo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar insumo', error: error.message });
  }
});

// GET /api/inputs/stats/costs - Estatísticas de custos por cultura
router.get('/stats/costs', async (req, res) => {
  try {
    const stats = await Input.aggregate([
      {
        $lookup: {
          from: 'cultures',
          localField: 'cultureId',
          foreignField: '_id',
          as: 'culture'
        }
      },
      {
        $unwind: '$culture'
      },
      {
        $group: {
          _id: {
            cultureName: '$culture.name',
            inputType: '$type'
          },
          totalCost: { $sum: '$totalCost' },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.cultureName',
          inputTypes: {
            $push: {
              type: '$_id.inputType',
              totalCost: '$totalCost',
              totalQuantity: '$totalQuantity',
              count: '$count'
            }
          },
          totalCostByCulture: { $sum: '$totalCost' }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar estatísticas de custos', error: error.message });
  }
});

module.exports = router;