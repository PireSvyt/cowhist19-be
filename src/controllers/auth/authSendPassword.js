require("dotenv").config();
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("./services/random_string.js");

module.exports = authSendPassword = (req, res, next) => {
  /*
  
  sent reset password email to a user
  
  possible response types
  * auth.sendpassword.success
  * auth.sendpassword.error.accountnotfound
  * auth.sendpassword.error.onfind
  * auth.sendpassword.error.updatingtoken
  * auth.sendpassword.error.sendingemail
  
  */

  if (process.env.DEBUG) {
    console.log("auth.sendpassword");
  }

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        user.passwordtoken = random_string(20);
        user
          .save()
          .then(() => {
            serviceMailing("resetpassword", user).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.sendpassword.success");
                return res.status(200).json({
                  type: "auth.sendpassword.success",
                });
              } else {
                console.log("auth.sendpassword.error.sendingemail");
                return res.status(400).json({
                  type: "auth.sendpassword.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.sendpassword.error.updatingtoken");
            console.error(error);
            return res.status(400).json({
              type: "auth.sendpassword.error.updatingtoken",
              error: error,
            });
          });
      } else {
        console.log("auth.sendpassword.error.accountnotfound");
        return res.status(404).json({
          type: "auth.sendpassword.error.accountnotfound",
        });
      }
    })
    .catch((error) => {
      console.log("auth.sendpassword.error.onfind");
      console.error(error);
      return res.status(404).json({
        type: "auth.sendpassword.error.onfind",
        error: error,
      });
    });
};
