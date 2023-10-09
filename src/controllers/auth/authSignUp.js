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
      if (user) {
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
                  id: user._id,
                },
              });
            })
            .catch((error) => {
              console.log("auth.signup.error.savingfrominvited");
              return res.status(400).json({
                type: "auth.signup.error.savingfrominvited",
                error: error,
                data: {
                  id: "",
                },
              });
            });
        } else {
          // Already existing
          console.log("auth.signup.success.alreadysignedup");
          return res.status(409).json({
            type: "auth.signup.success.alreadysignedup",
            data: {
              id: user._id,
            },
          });
        }
      } else {
        // Prep
        var user = new User({
          pseudo: req.body.pseudo,
          login: req.body.login,
          password: req.body.password,
          status: "signedup",
          activationtoken: random_string(20),
        });
        user.id = user._id;

        // User saving
        user
          .save()
          .then(() => {
            serviceMailing("signup", user).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.signup.success.signedup");
                return res.status(201).json({
                  type: "auth.signup.success.signedup",
                  data: {
                    id: user._id,
                  },
                });
              } else {
                console.log("auth.signup.error.sendingemail");
                return res.status(400).json({
                  type: "auth.signup.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.signup.error.savingoncreate");
            return res.status(400).json({
              type: "auth.signup.error.savingoncreate",
              error: error,
              data: {
                id: "",
              },
            });
          });
      }
    })
    .catch((error) => {
      console.log("auth.signup.error.notfound");
      return res.status(500).json({
        type: "auth.signup.error.notfound",
        error: error,
        data: {
          id: "",
        },
      });
    });
};
