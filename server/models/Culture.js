const mongoose = require('mongoose');

const cultureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Feijão', 'Milho', 'Capim', 'Sorgo', 'Manga', 'Acerola', 'Uva']
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // GeoJSON coordinates for polygon
      required: true
    }
  },
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date
  },
  variety: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    enum: ['Plantio', 'Crescimento', 'Floração', 'Frutificação', 'Colheita'],
    default: 'Plantio'
  },
  healthStatus: {
    type: String,
    enum: ['Excelente', 'Bom', 'Regular', 'Ruim', 'Crítico'],
    default: 'Bom'
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

// Index for geospatial queries
cultureSchema.index({ coordinates: '2dsphere' });

// Update the updatedAt field before saving
cultureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Culture', cultureSchema);