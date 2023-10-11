const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const xoauth2 = require('xoauth2'); 



const transport = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `Bo Slott <noreply@boslott.online>`,
    to: options.user.email,
    subject: options.subject,
    html: html,
    text: text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};

exports.receive = async (options) => {
  // const html = generateHTML(options.filename, options);
  // const text = htmlToText.fromString(html);

  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    // html: html,
    text: options.message
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};