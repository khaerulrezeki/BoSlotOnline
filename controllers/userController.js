const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const multer = require('multer');
const jimp = require('jimp'); // For resizing of photos
const uuid = require('uuid'); // Makes the files unique
const util = require('util');

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

// Saves the file into the memory of the server
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    console.log('Sorry buddy no resize');
    next(); // Skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // Now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(1024, jimp.AUTO);
  await photo.write(`./public/images/uploads/userImgs/${req.body.photo}`);
  // Once written to the filesystem, keep going!
  next();
};

exports.login = (req, res) => {
  if (req.user) {
    res.redirect('/admin-main')
  }
  else {
    res.render('login', { title: 'Admin Login '});
  }
};

exports.registration = (req, res) => {
  res.render('register', { title: 'New User Registration '});
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.sanitizeBody('role');
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match!').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg ));
    res.render('register', { title: 'New User Registration', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

exports.registerUser = async (req, res) => {
  const user = new User(req.body);

  // User.register method comes from the passportLocalMongoose package
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  res.redirect('/admin-main');
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.render('userAdmin', {title: 'All Users ', users });
};

exports.editUser = async (req, res) => {
  const peep = await User.findById(req.params.id)
  res.render('register', { title: 'Edit User ', peep });
};

exports.deleteUser = async (req, res) => {
  if (req.user._id == req.params.id) {
    req.flash('error', 'Cannot delete yourself!');
    console.log('Oopsie Poopsie');
    return res.redirect('/user-admin/edit');
  }

  const user = await User.remove({ _id: req.params.id }).exec();
  req.flash('success', 'User has been deleted! 💩');
  res.redirect('/user-admin/edit');
};
