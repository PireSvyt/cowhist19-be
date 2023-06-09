const User = require("../../models/User.js");

module.exports = authActivate = (req, res, next) => {
  /*
  
  activate a user
  once signed up and he reached the url with the token
  then his status is switched to activated
  
  possible response types
  * auth.activate.success.activated
  * auth.activate.success.alreadyctivated
  * auth.activate.error.onsave
  * auth.activate.error.notfound
  
  */

  console.log("auth.activate");

  User.findOne({ activationtoken: req.params.id })
    .then((user) => {
      if (user !== undefined) {
        // Signedup check
        if (user.status === "signedup") {
          user.status = "activated";

          // User saving
          user
            .save()
            .then(() => {
              res.status(200).json({
                type: "auth.activate.success.activated",
                data: {
                  id: user._id,
                },
              });
            })
            .catch((error) => {
              res.status(400).json({
                type: "auth.activate.error.onsave",
                error: error,
                data: {
                  id: user._id,
                },
              });
            });
        } else {
          if (user.status === "activated") {
            res.status(200).json({
              type: "auth.activate.success.alreadyctivated",
              data: {
                id: user._id,
              },
            });
          } else {
            return res.status(202).json({
              type: "auth.activate.error.notfound",
              data: {
                id: "",
              },
            });
          }
        }
      } else {
        return res.status(202).json({
          type: "auth.activate.error.notfound",
          data: {
            id: "",
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        type: "auth.activate.error.notfound",
        error: error,
        data: {
          id: "",
        },
      });
    });
};
