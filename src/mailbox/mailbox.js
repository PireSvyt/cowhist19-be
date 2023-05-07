var nodemailer = require("nodemailer");
//https://www.w3schools.com/nodejs/nodejs_email.asp

module.exports = {
  sendEmail: sendEmail,
};

function sendEmail(req, res, next) {
  console.log("auth.signup");
  let status = 500;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PW,
    },
  });

  let mailInputs = req.body;

  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: mailInputs.recipient,
    subject: mailInputs.subject,
    text: mailInputs.text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
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
