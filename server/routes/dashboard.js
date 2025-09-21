const express = require('express');
const router = express.Router();
const Culture = require('../models/Culture');
const Input = require('../models/Input');

// GET /api/dashboard/overview - Visão geral do dashboard
router.get('/overview', async (req, res) => {
  try {
    const [
      totalCultures,
      totalArea,
      recentInputs,
      culturesByType,
      monthlyExpenses,
      healthStatusCount
    ] = await Promise.all([
      Culture.countDocuments(),
      Culture.aggregate([{ $group: { _id: null, total: { $sum: '$area' } } }]),
      Input.find().sort({ createdAt: -1 }).limit(5).populate('cultureId', 'name'),
      Culture.aggregate([
        { $group: { _id: '$name', count: { $sum: 1 }, area: { $sum: '$area' } } }
      ]),
      Input.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$applicationDate' },
              month: { $month: '$applicationDate' }
            },
            totalCost: { $sum: '$totalCost' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
      Culture.aggregate([
        { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
      ])
    ]);

    const overview = {
      summary: {
        totalCultures,
        totalArea: totalArea[0]?.total || 0,
        totalInputs: await Input.countDocuments(),
        averageHealthScore: calculateAverageHealthScore(healthStatusCount)
      },
      recentActivity: recentInputs,
      cultureDistribution: culturesByType,
      monthlyExpenses: monthlyExpenses.map(expense => ({
        month: `${expense._id.month}/${expense._id.year}`,
        amount: expense.totalCost,
        count: expense.count
      })),
      healthStatus: healthStatusCount,
      lastUpdated: new Date().toISOString()
    };

    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar visão geral', error: error.message });
  }
});

// GET /api/dashboard/culture-performance - Performance das culturas
router.get('/culture-performance', async (req, res) => {
  try {
    const performance = await Culture.aggregate([
      {
        $lookup: {
          from: 'inputs',
          localField: '_id',
          foreignField: 'cultureId',
          as: 'inputs'
        }
      },
      {
        $project: {
          name: 1,
          variety: 1,
          area: 1,
          stage: 1,
          healthStatus: 1,
          plantingDate: 1,
          expectedHarvestDate: 1,
          totalInputCost: { $sum: '$inputs.totalCost' },
          inputCount: { $size: '$inputs' },
          costPerHectare: {
            $divide: [{ $sum: '$inputs.totalCost' }, '$area']
          },
          daysToHarvest: {
            $cond: {
              if: '$expectedHarvestDate',
              then: {
                $divide: [
                  { $subtract: ['$expectedHarvestDate', new Date()] },
                  86400000 // ms em um dia
                ]
              },
              else: null
            }
          }
        }
      },
      {
        $sort: { costPerHectare: -1 }
      }
    ]);

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao calcular performance das culturas', error: error.message });
  }
});

// GET /api/dashboard/financial-summary - Resumo financeiro
router.get('/financial-summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate || endDate) {
      dateFilter.applicationDate = {};
      if (startDate) dateFilter.applicationDate.$gte = new Date(startDate);
      if (endDate) dateFilter.applicationDate.$lte = new Date(endDate);
    }

    const [
      totalExpenses,
      expensesByType,
      expensesByMonth,
      topExpensiveCultures
    ] = await Promise.all([
      Input.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: '$totalCost' } } }
      ]),
      Input.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$type', total: { $sum: '$totalCost' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Input.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$applicationDate' },
              month: { $month: '$applicationDate' }
            },
            total: { $sum: '$totalCost' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Input.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'cultures',
            localField: 'cultureId',
            foreignField: '_id',
            as: 'culture'
          }
        },
        { $unwind: '$culture' },
        {
          $group: {
            _id: '$culture.name',
            total: { $sum: '$totalCost' },
            area: { $first: '$culture.area' }
          }
        },
        {
          $project: {
            name: '$_id',
            total: 1,
            costPerHectare: { $divide: ['$total', '$area'] }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ])
    ]);

    const financialSummary = {
      totalExpenses: totalExpenses[0]?.total || 0,
      expensesByType,
      monthlyTrend: expensesByMonth.map(month => ({
        month: `${month._id.month}/${month._id.year}`,
        amount: month.total
      })),
      topExpensiveCultures,
      period: {
        startDate: startDate || 'Início',
        endDate: endDate || 'Atual'
      },
      generatedAt: new Date().toISOString()
    };

    res.json(financialSummary);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar resumo financeiro', error: error.message });
  }
});

// GET /api/dashboard/alerts - Alertas e notificações
router.get('/alerts', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const alerts = [];

    // Alertas de colheita próxima
    const nearHarvest = await Culture.find({
      expectedHarvestDate: { $gte: today, $lte: nextWeek }
    });

    nearHarvest.forEach(culture => {
      alerts.push({
        type: 'harvest',
        priority: 'high',
        culture: culture.name,
        message: `Colheita de ${culture.name} (${culture.variety}) prevista para ${culture.expectedHarvestDate.toLocaleDateString()}`,
        date: culture.expectedHarvestDate
      });
    });

    // Alertas de saúde das plantas
    const unhealthyCultures = await Culture.find({
      healthStatus: { $in: ['Ruim', 'Crítico'] }
    });

    unhealthyCultures.forEach(culture => {
      alerts.push({
        type: 'health',
        priority: culture.healthStatus === 'Crítico' ? 'critical' : 'medium',
        culture: culture.name,
        message: `${culture.name} apresenta status de saúde: ${culture.healthStatus}`,
        date: new Date()
      });
    });

    // Alertas de gastos elevados
    const expensiveInputs = await Input.find({
      totalCost: { $gte: 1000 },
      applicationDate: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) }
    }).populate('cultureId', 'name');

    expensiveInputs.forEach(input => {
      alerts.push({
        type: 'expense',
        priority: 'medium',
        culture: input.cultureId.name,
        message: `Gasto elevado: ${input.name} - R$ ${input.totalCost.toFixed(2)}`,
        date: input.applicationDate
      });
    });

    // Ordenar por prioridade e data
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    alerts.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.date) - new Date(a.date);
    });

    res.json({
      alerts: alerts.slice(0, 20), // Limitar a 20 alertas
      summary: {
        critical: alerts.filter(a => a.priority === 'critical').length,
        high: alerts.filter(a => a.priority === 'high').length,
        medium: alerts.filter(a => a.priority === 'medium').length,
        low: alerts.filter(a => a.priority === 'low').length
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar alertas', error: error.message });
  }
});

// Função auxiliar para calcular score médio de saúde
function calculateAverageHealthScore(healthStatusCount) {
  const scores = {
    'Excelente': 5,
    'Bom': 4,
    'Regular': 3,
    'Ruim': 2,
    'Crítico': 1
  };

  let totalScore = 0;
  let totalCount = 0;

  healthStatusCount.forEach(status => {
    totalScore += scores[status._id] * status.count;
    totalCount += status.count;
  });

  return totalCount > 0 ? (totalScore / totalCount).toFixed(1) : 0;
}

module.exports = router;