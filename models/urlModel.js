const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({

  destinationUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  remarks: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  analytics: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: { type: String },
      userAgent: { type: String },
    },
  ],
});

module.exports = mongoose.model('Link', UrlSchema);
