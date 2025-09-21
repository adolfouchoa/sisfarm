const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  cultureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Culture',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Fertilizante', 'Defensivo', 'Sementes', 'Irrigação', 'Mão de obra', 'Maquinário', 'Outros']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'L', 'ton', 'sacos', 'horas', 'dias', 'unidades']
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    phone: String
  },
  applicationDate: {
    type: Date,
    required: true
  },
  applicationMethod: {
    type: String,
    enum: ['Manual', 'Pulverização', 'Irrigação', 'Incorporação ao solo', 'Outros']
  },
  weather: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    conditions: String
  },
  responsible: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
inputSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Calculate total cost
  this.totalCost = this.quantity * this.costPerUnit;
  next();
});

module.exports = mongoose.model('Input', inputSchema);