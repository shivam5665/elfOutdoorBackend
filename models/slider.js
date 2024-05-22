const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  optimizeUrl: {
    type: String,
    required: true
  },
  autoCropUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Upload', uploadSchema);
