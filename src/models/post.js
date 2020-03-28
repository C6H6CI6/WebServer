const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	id: String,
  title: String,
  content: String,
  summary: String,
  image: String,
  date: String,
  author: String,
  n_comments: Number,
  n_thumbups: Number,
  n_tokens: Number
}, {
    timestamps: true,
  });

const Posts = mongoose.model('Posts', PostSchema);
module.exports = { Posts };