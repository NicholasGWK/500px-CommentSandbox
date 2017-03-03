const nodemailer = require('nodemailer');
const email = require('./email.js')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: email,
});


module.exports = transporter;
