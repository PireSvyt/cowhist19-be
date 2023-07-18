const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");
const serviceMailing = require("../../mail/serviceMailing");

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
      serviceMailing("signup", {
        psuedo: "TEST PSEUDO",
        login: process.env.MAIL_ADDRESS,
        activationtoken: "TEST TOKEN",
      }).then((mail) => {
        if (mail.type === "mail.mailing.success") {
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
