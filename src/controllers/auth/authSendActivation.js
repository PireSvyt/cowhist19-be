require("dotenv").config();
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("./services/random_string.js");

module.exports = authSentActivation = (req, res, next) => {
  /*
  
  resent activation email to a user
  
  possible response types
  * auth.sendactivation.success
  * auth.sendactivation.error.accountnotfound
  * auth.sendactivation.error.onfind
  * auth.sendactivation.error.updatingtoken
  * auth.sendactivation.error.sendingemail
  
  */

  if (process.env.DEBUG) {
    console.log("auth.sendactivation");
  }

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        user.activationtoken = random_string(20);
        user
          .save()
          .then(() => {
            serviceMailing("signup", user).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.sendactivation.success");
                return res.status(200).json({
                  type: "auth.sendactivation.success",
                });
              } else {
                console.log("auth.sendactivation.error.sendingemail");
                return res.status(400).json({
                  type: "auth.sendactivation.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.sendactivation.error.updatingtoken");
            console.error(error);
            return res.status(400).json({
              type: "auth.sendactivation.error.updatingtoken",
              error: error,
            });
          });
      } else {
        console.log("auth.sendactivation.error.accountnotfound");
        return res.status(404).json({
          type: "auth.sendactivation.error.accountnotfound",
        });
      }
    })
    .catch((error) => {
      console.log("auth.sendactivation.error.onfind");
      console.error(error);
      return res.status(404).json({
        type: "auth.sendactivation.error.onfind",
        error: error,
      });
    });
};
