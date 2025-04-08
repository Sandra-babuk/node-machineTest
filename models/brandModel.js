const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    unique: true,
    required: true
  },
  brandLogo: {
    type: String,
    required: false
  },
  categories: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Brand', brandSchema);
