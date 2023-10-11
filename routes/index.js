const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const adminController = require('../controllers/adminController');
const projectController = require('../controllers/projectController');
const blogController = require('../controllers/blogController');
const commentsController = require('../controllers/commentsController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');


// Front-Side Routes
router.get('/', siteController.home);
router.get('/about', siteController.about);
router.get('/services', siteController.services);
router.get('/portfolio', catchErrors(siteController.portfolio));
router.get('/portfolio/details/:slug', catchErrors(siteController.getProjectBySlug));
router.get('/blog', catchErrors(siteController.blog));
router.get('/blog/:slug', catchErrors(siteController.getPostBySlug));
router.get('/contact', siteController.contact);
router.post('/contact', catchErrors(siteController.sendContact));



//  ---------------------
//  User / Auth Routes
//  ---------------------
  router.get('/user-login', userController.login);
  router.post('/user-login', authController.loginUser);

  router.get('/new-registration',
    authController.isLoggedIn,
    userController.registration);
  router.post('/new-registration',
    authController.isLoggedIn,
    userController.upload,
    catchErrors(userController.resize),
    userController.validateRegister,
    catchErrors(userController.registerUser)
  );

  router.get('/user-admin/edit', catchErrors(userController.getUsers));
  router.get('/user-admin/:id/edit', catchErrors(userController.editUser));
  router.get('/user-admin/:id/delete', catchErrors(userController.deleteUser));

  router.post('/account/forgot', catchErrors(authController.forgot));
  router.get('/account/reset/:token', catchErrors(authController.reset));
  router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
  );

  router.get('/logout', authController.logout);


//  ---------------------
//  Admin Routes
//  ---------------------
  router.get('/admin-main',
    authController.isLoggedIn,
    catchErrors(adminController.dashboard));
  
 


//  ---------------------
//  Project Routes
//  ---------------------
  router.get('/portfolio-admin/create', projectController.portfolioAdminCreate);
  router.post('/portfolio-admin/create',
    projectController.upload,
    catchErrors(projectController.resize),
    catchErrors(projectController.createPortfolioProject)
  );

  router.post('/portfolio-admin/create/:id',
    projectController.upload,
    catchErrors(projectController.resize),
    catchErrors(projectController.updateProject)
  );

  router.get('/portfolio-admin/edit', catchErrors(projectController.getProjects));
  router.get('/portfolio-admin/:id/edit', projectController.editProject);
  router.get('/portfolio-admin/:id/delete', catchErrors(projectController.deleteProject));


//  ---------------------
//  Blog Routes
//  ---------------------
  router.get('/blog-admin/create', blogController.blogAdminCreate);
  router.post('/blog-admin/create', 
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.createBlogPost)
  );

  router.post('/blog-admin/create/:id', 
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.updateBlogPost)
  );

  router.get('/blog-admin/edit', catchErrors(blogController.getBlogPosts));
  router.get('/blog-admin/:id/edit', blogController.editBlogPost);
  router.get('/blog-admin/:id/delete', catchErrors(blogController.deleteBlogPost));


//  ---------------------
//  Comment Routes
//  ---------------------
  router.post('/blog/:slug/:id', catchErrors(commentsController.addComment));


module.exports = router;