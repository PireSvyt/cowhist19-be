const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("./services/random_string.js");

module.exports = authResentActivation = (req, res, next) => {
  /*
  
  resent activation email to a user
  
  possible response types
  * auth.resentactivation.success
  * auth.resentactivation.error.accountnotfound
  * auth.resentactivation.error.onfind
  * auth.resentactivation.error.updatingtoken
  * auth.resentactivation.error.sendingemail
  
  */

  console.log("auth.resentactivation");

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        user.activationtoken = random_string(20);
        user
          .save()
          .then(() => {
            serviceMailing("signup", user).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.resentactivation.success");
                return res.status(200).json({
                  type: "auth.resentactivation.success",
                });
              } else {
                console.log("auth.resentactivation.error.sendingemail");
                return res.status(400).json({
                  type: "auth.resentactivation.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.resentactivation.error.updatingtoken");
            console.error.(error)
            return res.status(400).json({
              type: "auth.resentactivation.error.updatingtoken",
              error: error,
            });
          });
      } else {
        console.log("auth.resentactivation.error.accountnotfound");
        return res.status(404).json({
          type: "auth.resentactivation.error.accountnotfound",
        });
      }
    })
    .catch((error) => {
      console.log("auth.resentactivation.error.onfind");
      console.error.(error)
      return res.status(404).json({
        type: "auth.resentactivation.error.onfind",
        error: error,
      });
    });
};
