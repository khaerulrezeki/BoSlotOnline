const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const Post = mongoose.model('Post');

exports.addComment = async (req, res) => {
  const comment = await (new Comment(req.body)).save()
    .then(comment => Post.findByIdAndUpdate(req.params.id,
      { $push: { comments: { _id: comment._id  }}},
      { new: true }));
  res.redirect(`/blog/${req.params.slug}`);
};