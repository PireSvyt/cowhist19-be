const User = require("../../models/User.js");
var random_string = require("./services/random_string.js");

module.exports = authSignup = (req, res, next) => {
  /*
  
  signup a user
  
  IMPORTANT NOTE : 
    NO ENCRYPTION OF PASSWORD HERE
    password is encrypted on FE side and saved as provided!
  
  possible response types
  * auth.signup.success.signedup
  * auth.signup.success.alreadysignedup
  * auth.signup.error.notfound
  * auth.signup.error.savingoncreate
  * auth.signup.error.savingfrominvited
  
  */

  console.log("auth.signup");

  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        // Invited
        if (user.status === "invited") {
          // User edit
          user.pseudo = req.body.pseudo;
          user.status = "signedup";
          user.activationtoken = random_string(20);

          // User saving
          user
            .save()
            .then(() => {
              res.status(200).json({
                type: "auth.signup.success.signedup",
                message: "user signed up from invited",
                data: {
                  id: user._id,
                },
              });
            })
            .catch((error) => {
              res.status(400).json({
                type: "auth.signup.error.savingfrominvited",
                error,
                message: "erreur lors de la création",
                data: {
                  id: "",
                },
              });
            });
        } else {
          // Already existing
          return res.status(409).json({
            type: "auth.signup.success.alreadysignedup",
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
          activationtoken: random_string(20),
        });
        user.id = user._id;

        // User saving
        user
          .save()
          .then(() => {
            res.status(201).json({
              type: "auth.signup.success.signedup",
              message: "user signedup creation",
              data: {
                id: user._id,
              },
            });
          })
          .catch((error) => {
            res.status(400).json({
              type: "auth.signup.error.savingoncreate",
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
      res.status(500).json({
        type: "auth.signup.error.notfound",
        error,
        message: "erreur user not found",
        data: {
          id: "",
        },
      });
    });
};
