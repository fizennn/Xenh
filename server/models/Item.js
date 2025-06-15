const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: String,
  color: String,
  pattern: String,
  style: String,
  name: String,
  img: String,
  user_id: String,
},{ timestamps: true });

module.exports = mongoose.model('Item', itemSchema);