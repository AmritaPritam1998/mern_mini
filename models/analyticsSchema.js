const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    userAgent: { type: String },
  });
  
  module.exports = mongoose.model('Analytics', AnalyticsSchema);
  