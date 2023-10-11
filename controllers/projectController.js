const mongoose = require('mongoose');
const Project = mongoose.model('Project');
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


exports.portfolioAdminCreate = (req, res) => {
  res.render('portfolioAdminCreate', { title: 'Create New Project '});
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
  await photo.write(`./public/images/uploads/projectImgs/${req.body.photo}`);
  // Once written to the filesystem, keep going!
  next();
};

exports.createPortfolioProject = async (req, res) => {
  const project = await (new Project(req.body)).save();
  req.flash('success', `You have successfully uploaded ${project.name}! 🔱 💻 🔱`);
  res.redirect('/portfolio-admin/edit');
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find();
  res.render('portfolioAdminEdit', { projects, title: 'Edit Projects '});
};

exports.editProject = async (req, res) => {
  // 1. Find the project given the id
  const project = await Project.findOne({ _id: req.params.id });

  // 2. Render out the edit form to edit the project
  res.render('portfolioAdminCreate', { title: `Edit ${project.name}`, project });
};

exports.updateProject = async (req, res) => {
  // Find and update the project
  const project = await Project.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // Return the new project instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated '${project.name}'`);
  // 2. Redirect to the edit projects page and tell it worked
  res.redirect(`/portfolio-admin/edit`);
};

exports.deleteProject = async (req, res) => {
  const project = await Project.remove({ _id: req.params.id }).exec();
  req.flash('success', `Successfully removed project`);
  res.redirect('/portfolio-admin/edit');
};

