const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/

const User = require("../../models/User.js");
var toolkit = require("../../ressources/toolkit.js");

module.exports = signup = (req, res, next) => {
  /*
  
  signup a user
  
  IMPORTANT NOTE : 
    NO ENCRYPTION OF PASSWORD HERE
    password is encrypted on FE side and saved as provided!
  
  possible response types
  * auth.signup.signedup
  * auth.signup.success.alreadysignedup
  * auth.signup.error.notfound
  * auth.signup.error.savingoncreate
  * auth.signup.error.savingfrominvited
  
  */

  console.log("auth.signup");

  // Initialize
  let status = 500;
  var type = "auth.signup.error";

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        // Invited
        if (user.status === "invited") {
          // User edit
          user.pseudo = req.body.pseudo;
          user.status = "signedup";
          user.activationtoken = toolkit.random_string(20);

          // User saving
          user
            .save()
            .then(() => {
              status = 200;
              type = "auth.signup.signedup";
              res.status(status).json({
                type: type,
                message: "user signed up from invited",
                data: {
                  id: user._id,
                },
              });
            })
            .catch((error) => {
              status = 400;
              type = "auth.signup.error.savingfrominvited";
              res.status(status).json({
                type: type,
                error,
                message: "erreur lors de la création",
                data: {
                  id: "",
                },
              });
            });
        } else {
          // Already existing
          status = 409;
          type = "auth.signup.success.alreadysignedup";
          return res.status(status).json({
            type: type,
            message: "utilisateur déjà existant",
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
          activationtoken: toolkit.random_string(20),
        });
        user.id = user._id;

        // User saving
        user
          .save()
          .then(() => {
            status = 201;
            type = "auth.signup.success.signedup";
            res.status(status).json({
              type: type,
              message: "user signedup creation",
              data: {
                id: user._id,
              },
            });
          })
          .catch((error) => {
            status = 400;
            type = "auth.signup.error.savingoncreate";
            res.status(status).json({
              type: type,
              error,
              message: "erreur lors de la création",
              data: {
                id: "",
              },
            });
          });
      }
    })
    .catch((error) => {
      status = 500;
      type = "auth.signup.error.notfound";
      res.status(status).json({
        type: type,
        error,
        message: "erreur user not found",
        data: {
          id: "",
        },
      });
    });
};
