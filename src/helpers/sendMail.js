const nodemailer = require('nodemailer');
const devConfig = require('../config/dev.config');

exports.sendmailtouser = async (email, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: devConfig.EMAIL_CONFIG.host,
      port: devConfig.EMAIL_CONFIG.port,
      secure: false,
      auth: {
        user: devConfig.EMAIL_CONFIG.from_address,
        pass: devConfig.EMAIL_CONFIG.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: devConfig.EMAIL_CONFIG.from_address,
      to: email,
      subject: subject,
      html: body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return 1;
  } catch (error) {
    console.log(error);
  }
};