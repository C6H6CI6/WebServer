const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  avatar: String,
  ckb_address: String,
  ckb_public_key: String,
  muta_address: String,
  muta_public_key: String,
  n_likes: Number,
  n_comments: Number,
  n_tokens: Number
}, {
    timestamps: true,
  });

// Model
const User = mongoose.model('User', UserSchema);
module.exports = { User };