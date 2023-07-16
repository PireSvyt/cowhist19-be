const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");
const serviceSendMail = require("../../mail/serviceSentMail.js");

const testMail = {
  to: process.env.MAIL_ADDRESS,
  subject: "TEST " + new Date(),
  text: "TEST " + new Date(),
  html: null,
};

module.exports = emailTest = (req, res, next) => {
  /*
  
  test the mail service by self sending an email
  
  possible response types
  * admin.emailtest.success
  * admin.emailtest.error.deniedaccess
  * admin.emailtest.error.failure
  
  */

  console.log("admin.emailtest");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.emailtest.error.deniedaccess",
        error: access.reason,
      });
    } else {
      serviceSendMail(testMail).then((mail) => {
        if (mail.type === "mail.sentmail.success") {
          res.status(200).json({
            type: "admin.emailtest.success",
            info: mail.info,
          });
        } else {
          res.status(500).json({
            type: "admin.emailtest.error.failure",
            error: mail.error,
          });
        }
      });
    }
  });
};
