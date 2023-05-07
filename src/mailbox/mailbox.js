var nodemailer = require("nodemailer");
//https://www.w3schools.com/nodejs/nodejs_email.asp

module.exports = {
  sendEmail: sendEmail,
};

function sendEmail(req, res, next) {
  console.log("auth.signup");
  let status = 500;

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "96c9c3cae3954b",
      pass: "bc2f8d3bb0a5dc",
    },
  });
  /*
  var transport = nodemailer.createTransport({
    service: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PW,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  */

  let mailInputs = req.body;

  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: mailInputs.recipient,
    subject: mailInputs.subject,
    text: mailInputs.text,
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error in sendMail",
        error: error,
      });
    } else {
      status = 200;
      res.status(status).json({
        status: status,
        message: "mail sent",
        info: info,
      });
    }
  });
}
