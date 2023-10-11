/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Bo Slott Online - Full Stack Web Developer`;

exports.menu = [
  {
    slug: '/',
    title: 'Home',
    icon: 'home'
  }, {
    slug: '/about',
    title: 'About',
    icon: ''
  }, {
    slug: '/services',
    title: 'Services',
    icon: ''
  }, {
    slug: '/portfolio',
    title: 'Portfolio',
    icon: ''
  }, {
    slug: '/blog',
    title: 'Blog',
    icon: ''
  }, {
    slug: '/contact',
    title: 'Contact',
    icon: ''
  }
];

exports.adminNav = [
  {
    slug: '/admin-main',
    title: 'Dashboard',
    icon: 'dashboard'
  }, {
    slug: '#blogAdminItems', 
    title: 'Blog Admin',
    icon: 'description',
    itemsId: 'blogAdminItems',
    aria: false,
    dataToggle: 'collapse',
    drops: [{
      dropTitle: 'Create New Blog Post',
      dropIcon: 'add_circle_outline',
      dropLink: '/blog-admin/create'
    }, {
      dropTitle: 'Edit Blog Post',
      dropIcon: 'edit',
      dropLink: '/blog-admin/edit'
    }]
  }, {
    slug: '#portfolioAdminItems',
    title: 'Portfolio Admin',
    icon: 'library_books',
    itemsId: 'portfolioAdminItems',
    aria: false,
    dataToggle: 'collapse',
    drops: [{
      dropTitle: 'Create New Project',
      dropIcon: 'add_circle_outline',
      dropLink: '/portfolio-admin/create'
    }, {
      dropTitle: 'Edit Projects',
      dropIcon: 'edit',
      dropLink: '/portfolio-admin/edit'
    }]
  }, {
    slug: '#userAdminItems',
    title: 'User Admin',
    icon: 'face',
    itemsId: 'userAdminItems',
    aria: false,
    dataToggle: 'collapse',
    drops: [{
      dropTitle: 'New User Registration',
      dropIcon: 'person_add',
      dropLink: '/new-registration'
    }, {
      dropTitle: 'Edit Users',
      dropIcon: 'people',
      dropLink: '/user-admin/edit'
    }]
  }, {
    slug: '/',
    title: 'Site',
    icon: 'home'
  }
];
