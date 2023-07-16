const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = async function serviceSendMail(mailDetails) {
  /*
    
    service sending email
    
    input
    * mailDetails: a dict with all required email details
        - to: recipient email adress
        - subject: email subject
        - text: email flat text
        - html: email html code

    possible response types
    * mail.sentmail.success
    * mail.sentmail.failure
    
    */

  console.log("mail.sentmail");

  transporter
    .sendMail({
      from: process.env.MAIL_ADDRESS,
      to: mailDetails.to,
      subject: mailDetails.subject,
      text: mailDetails.text,
      html: mailDetails.html,
    })
    .then((info) => {
      return {
        type: "mail.sentmail.success",
        info: info,
      };
    })
    .catch((err) => {
      return {
        type: "mail.sentmail.failure",
        error: info,
      };
    });
};
