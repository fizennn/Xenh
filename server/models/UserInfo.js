const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  avata_url: String,
  gender: String,
  height: Number,
  weight: Number,
  role: String,
  status: String,
  full_name: String,
  id_user: String,
},{ timestamps: true });

module.exports = mongoose.model('UserInfo', userInfoSchema);