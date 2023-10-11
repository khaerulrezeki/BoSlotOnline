const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail'); 

exports.loginUser = passport.authenticate('local', {
  failureRedirect: '/user-login',
  failureFlash: 'Failed Login!',
  successRedirect: '/admin-main',
  successFlash: 'You are now logged in! 👏 👏 👏'
});
 
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 😜');
  res.redirect('/user-login');
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Oops! You must be logged in to do that!');
  res.redirect('/user-login');
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account with that email exists');
    return res.redirect('/user-login');
  }

  // 2. Set rest tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordTokenExpires = Date.now() + 3600000 // One hour from now
  await user.save();

  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user: user,
    subject: 'Password Reset',
    resetURL: resetURL,
    filename: 'password-reset'  // Pug file for email template
  });
  req.flash('success', `You have been emailed a password reset link`);
  
  // 4. Redirect to the login after the token has been sent
  res.redirect('/user-login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpires: { $gt: Date.now() }  // $gt = greater than
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or expired');
    return res.redirect('/user-login');
  }
  // If there is a user, show the reset password form
  res.render('reset', { title: 'Reset Your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpires: { $gt: Date.now() }  // $gt = greater than
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or expired');
    return res.redirect('/user-login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', '🕺 Yay! Your password has been reset! You are now logged in!');
  res.redirect('/admin-main');
};