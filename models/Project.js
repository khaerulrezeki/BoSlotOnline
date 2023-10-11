const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a project name!'
  },
  category: {
    type: String,
    trim: true,
    required: 'Please enter a project category!'
  },
  photo: String,
  miniDescription: {
    type: String,
    trim: true,
    required: 'Please enter a mini description!'
  },
  fullDescriptionParagraphs: [String],
  clientName: {
    type: String,
    trim: true
  },
  slug: String,      // Link to the details page
  liveLink: String,
  servicesList: [String],
  featuresList: [String],
  technologiesList: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', async function(next) {
  if(!this.isModified('name')) {
    next(); // Skit it
    return; // Stop this function from running
  }
  this.slug = slug(this.name);
  // Find other projects that have a slug of name, name-1, name-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const projectsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (projectsWithSlug.length) {
    this.slug = `${this.slug}-${projectsWithSlug.length + 1}`;
  }
  next();
  
});

module.exports = mongoose.model('Project', projectSchema);