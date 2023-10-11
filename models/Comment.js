const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
    required: 'Please suppy an author!'
  },
  authorEmail: {
    type: String,
    required: 'Please suppy a valid email address'
  },
  created: {
    type: Date,
    default: Date.now
  },
  body: String
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;