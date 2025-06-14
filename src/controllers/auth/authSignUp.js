require("dotenv").config();
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("./services/random_string.js");

module.exports = authSignup = (req, res, next) => {
  /*
  
  signup a user
  
  IMPORTANT NOTE : 
    ON SIGN UP,
      ENCRYPTION IS DONE IN FRONTEND
      PASSWORD IS SAVED AS IS
    ON SIGN IN
      NO ENCRYPTION IS DONE
      COMPARE HAPPENS IN BACKEND
  
  possible response types
  * auth.signup.success.signedup
  * auth.signup.success.alreadysignedup
  * auth.signup.error.notfound
  * auth.signup.error.savingoncreate
  * auth.signup.error.savingfrominvited
  
  */

  if (process.env.DEBUG) {
    console.log("auth.signup");
  }

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        // Prep
        var user = new User({
          userid: random_string(24),
          pseudo: req.body.pseudo,
          login: req.body.login,
          password: req.body.password,
          status: "signedup",
          activationtoken: random_string(20),
          priviledges: ["none"],
        });
        if (user.userid === undefined) {
          user.userid = user._id;
        }

        // User saving
        user
          .save()
          .then(() => {
            if (req.body.mailing !== "none") {
              serviceMailing("signup", user).then((mailing) => {
                if (mailing.type === "mail.mailing.success") {
                  console.log("auth.signup.success.signedup");
                  return res.status(201).json({
                    type: "auth.signup.success.signedup",
                    data: {
                      userid: user.userid,
                    },
                  });
                } else {
                  console.log("auth.signup.error.sendingemail");
                  return res.status(400).json({
                    type: "auth.signup.error.sendingemail",
                  });
                }
              });
            } else {
              console.log("auth.signup.success.signedup no mail sent");
              return res.status(201).json({
                type: "auth.signup.success.signedup",
                note: "no mail sent",
                data: {
                  userid: user.userid,
                },
              });
            }
          })
          .catch((error) => {
            console.log("auth.signup.error.savingoncreate");
            return res.status(400).json({
              type: "auth.signup.error.savingoncreate",
              error: error,
              data: {
                userid: "",
              },
            });
          });
      } else {
        // Invited
        if (user.status === "invited") {
          // User edit
          user.pseudo = req.body.pseudo;
          user.status = "signedup";
          user.password = req.body.password;
          user.activationtoken = random_string(20);

          // User saving
          user
            .save()
            .then(() => {
              serviceMailing("signup", user);
              console.log("auth.signup.success.signedup");
              return res.status(200).json({
                type: "auth.signup.success.signedup",
                data: {
                  userid: user.userid,
                },
              });
            })
            .catch((error) => {
              console.log("auth.signup.error.savingfrominvited");
              return res.status(400).json({
                type: "auth.signup.error.savingfrominvited",
                error: error,
                data: {
                  userid: "",
                },
              });
            });
        } else {
          // Already existing
          console.log("auth.signup.success.alreadysignedup");
          return res.status(409).json({
            type: "auth.signup.success.alreadysignedup",
            data: {
              userid: user.userid,
            },
          });
        }
      }
    })
    .catch((error) => {
      console.log("auth.signup.error.notfound");
      return res.status(500).json({
        type: "auth.signup.error.notfound",
        error: error,
        data: {
          userid: "",
        },
      });
    });
};
