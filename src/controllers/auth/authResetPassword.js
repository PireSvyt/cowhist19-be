const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("./services/random_string.js");

module.exports = authResetPAssword = (req, res, next) => {
  /*
  
  sent reset password email to a user
  
  possible response types
  * auth.resetpassword.success
  * auth.resetpassword.error.accountnotfound
  * auth.resetpassword.error.onfind
  * auth.resetpassword.error.updatingtoken
  * auth.resetpassword.error.sendingemail
  
  */

  console.log("auth.resetpassword");

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        user.passwordtoken = random_string(20);
        user
          .save()
          .then(() => {
            serviceMailing("resetpassword", user).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.resetpassword.success");
                return res.status(200).json({
                  type: "auth.resetpassword.success",
                });
              } else {
                console.log("auth.resetpassword.error.sendingemail");
                return res.status(400).json({
                  type: "auth.resetpassword.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.resetpassword.error.updatingtoken");
            console.error.(error)
            return res.status(400).json({
              type: "auth.resetpassword.error.updatingtoken",
              error: error,
            });
          });
      } else {
        console.log("auth.resetpassword.error.accountnotfound");
        return res.status(404).json({
          type: "auth.resetpassword.error.accountnotfound",
        });
      }
    })
    .catch((error) => {
      console.log("auth.resetpassword.error.onfind");
      console.error.(error)
      return res.status(404).json({
        type: "auth.resetpassword.error.onfind",
        error: error,
      });
    });
};
