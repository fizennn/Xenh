const mongoose = require('mongoose');

const wardrobeSchema = new mongoose.Schema({
  user_id: { type: String, ref: 'User', required: true },
  item_id: [{type: String}],
},{ timestamps: true });

module.exports = mongoose.model('Wardrobe', wardrobeSchema);