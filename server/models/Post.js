const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_id: { type: String, ref: 'User', required: true },
  description: String,
  image_url: String,
  favs: [{ type: String, ref: 'User' }],
  items: [{ type: String, ref: 'Item' }],
},{ timestamps: true });

module.exports = mongoose.model('Post', postSchema);