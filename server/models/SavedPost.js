const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  user_id: { type: String, ref: 'User', required: true },
  post_id: [{ type: String, ref: 'Post', required: true }],
},{ timestamps: true });

module.exports = mongoose.model('SavedPost', savedPostSchema);