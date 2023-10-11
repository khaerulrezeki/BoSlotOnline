const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const multer = require('multer');
const jimp = require('jimp'); // For resizing of photos
const uuid = require('uuid'); // Makes the files unique

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That file type isn\'t allowed! '}, false);
    }
  }
};

exports.blogAdminCreate = (req, res) => {
  res.render('blogAdminCreate', { title: 'Create New Blog Post '});
};

// Saves the file into the memory of the server
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    next(); // Skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // Now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(1024, jimp.AUTO);
  await photo.write(`./public/images/uploads/postImgs/${req.body.photo}`);
  // Once written to the filesystem, keep going!
  next();
};

exports.createBlogPost = async (req, res) => {
  const post = await (new Post(req.body)).save();
  req.flash('success', `You have successfully uploaded ${post.title}! 🔱 💻 🔱`);
  res.redirect('/blog-admin/edit');
};

 
exports.getBlogPosts = async (req, res) => {
  const posts = await Post.find();
  res.render('blogAdminEdit', { posts, title: 'Edit Blog Posts '});
};

exports.editBlogPost = async (req, res) => {
  // 1. Find the post given the id
  const post = await Post.findOne({ _id: req.params.id });

  // 2. Render out the edit form to edit the post
  res.render('blogAdminCreate', { title: `Edit ${post.title}`, post });
};

exports.updateBlogPost = async (req, res) => {
  // Find and update the post
  const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // Return the new post instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated '${post.title}'`);
  // 2. Redirect to the edit posts page and tell it worked
  res.redirect(`/blog-admin/edit`);
};

exports.deleteBlogPost = async (req, res) => {
  const post = await Post.remove({ _id: req.params.id }).exec();
  req.flash('success', `Successfully removed post`);
  res.redirect('/blog-admin/edit');
};