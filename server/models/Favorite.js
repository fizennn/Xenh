const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  fav_id: { type: String, required: true, unique: true },
  post_id: { type: String, ref: 'Post', required: true },
  user_id: { type: String, ref: 'User', required: true },
},{ timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);