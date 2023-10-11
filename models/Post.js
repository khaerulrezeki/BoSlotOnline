const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const sanitizeHtml = require('sanitize-html');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please provide a title!'
  },
  slug: String,
  photo: String,
  author: {
    type: String,
    trim: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  categories: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  body: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

postSchema.pre('save', async function(next) {
  if(!this.isModified('title')) {
    next(); // Skit it
    return; // Stop this function from running
  }
  this.slug = slug(this.title);
  // Find other projects that have a slug of name, name-1, name-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const postsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (postsWithSlug.length) {
    this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
  }
  next();
  
});

postSchema.pre('save', function(next) {
  const bodyContent = sanitizeHtml(this.body);
  this.body = bodyContent;
  next();
});


module.exports = mongoose.model('Post', postSchema);
