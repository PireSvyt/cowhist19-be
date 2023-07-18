const serviceMailing = require("../../mail/serviceMailing");

module.exports = adminEmailTest = (req, res, next) => {
  /*
  
  test the mail service by self sending an email
  
  possible response types
  * admin.emailtest.success
  * admin.emailtest.error.deniedaccess
  * admin.emailtest.error.failure
  
  */

  console.log("admin.emailtest");

  serviceMailing("signup", {
    pseudo: "TESTPSEUDO",
    login: process.env.MAIL_ADDRESS,
    activationtoken: "TESTTOKEN",
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
};
