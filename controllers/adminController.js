const mongoose = require('mongoose');
const User = mongoose.model('User');
const Project = mongoose.model('Project');
const Post = mongoose.model('Post');

exports.dashboard = async (req, res) => {
  const projects = await Project.find();
  const posts = await Post.find();
  res.render('adminDash', { title: 'Admin Dashboard', projects, posts });
};





