const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Post = mongoose.model('Post');
const mail = require('../handlers/mail');

exports.home = (req, res) => {
  res.render('index', { title: 'Bo Slott Online '});
};

exports.about = (req, res) => {
  res.render('about', { title: 'About ' }); 
};

exports.services = (req, res) => {
  res.render('services', { title: 'Services ' });
};

exports.portfolio = async (req, res) => {
  const projects = await Project.find();
  res.render('portfolio', { title: 'Portfolio ', projects });
};

exports.getProjectBySlug = async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return next();
  res.render('projectDetails', { project, title: project.name });
};

exports.blog = async (req, res) => {
  const posts = await Post.find();
  res.render('blog', { title: 'Blog ', posts });
};

exports.getPostBySlug = async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('comments')
    .then(post => { res.render('postDetails', { title: `${post.title} | Bo Slott Online Full Stack Web Developer `, post })});
};

exports.contact = (req, res) => {
  res.render('contact', { title: 'Contact ' });
};

exports.sendContact =  async (req, res) => {

  await mail.receive({
    to: 'boslott@gmail.com',
    from: req.body.from,
    subject: `<boslott.online> Message From ${req.body.name} at ${req.body.from} `,
    message: req.body.message,
    fromName: req.body.name
    // filename: 'password-reset'  // Pug file for email template
  });
  req.flash('success', `You have sent Bo a message! 👏`);
  
  // 4. Redirect to the login after the token has been sent
  res.redirect('/contact');
};


