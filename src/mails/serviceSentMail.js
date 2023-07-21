const nodemailer = require("nodemailer");

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

  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        from: "'CoWhist19 team <" + process.env.MAIL_ADDRESS + ">'",
        to: mailDetails.to,
        subject: mailDetails.subject,
        text: mailDetails.text,
        html: mailDetails.html,
      })
      .then((info) => {
        console.log("mail.sentmail.success");
        resolve({
          type: "mail.sentmail.success",
          info: info,
        });
      })
      .catch((err) => {
        console.log("mail.sentmail.failure");
        resolve({
          type: "mail.sentmail.failure",
          error: err,
        });
      });
  });
};

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});
