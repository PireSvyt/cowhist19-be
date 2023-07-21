const User = require("../../models/User.js");

module.exports = authActivate = (req, res, next) => {
  /*
  
  activate a user
  once signed up and he recieves an email to reach the url with the token
  then his status is switched to activated
  (only activated user have access to the product capabilities)
  
  possible response types
  * auth.activate.success.activated
  * auth.activate.success.alreadyctivated
  * auth.activate.error.onsave
  * auth.activate.error.notfound
  
  */

  console.log("auth.activate");

  User.findOne({ activationtoken: req.params.token })
    .then((user) => {
      if (user !== undefined) {
        // Signedup check
        if (user.status === "signedup") {
          user.status = "activated";

          // User saving
          user
            .save()
            .then(() => {
              console.log("auth.activate.success.activated");
              res.status(200).json({
                type: "auth.activate.success.activated",
                data: {
                  id: user._id,
                },
              });
            })
            .catch((error) => {
              console.log("auth.activate.error.onsave");
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
            console.log("auth.activate.success.alreadyctivated");
            res.status(200).json({
              type: "auth.activate.success.alreadyctivated",
              data: {
                id: user._id,
              },
            });
          } else {
            // Non discolusre of acount existance
            console.log("auth.activate.error.notfound");
            return res.status(202).json({
              type: "auth.activate.error.notfound",
            });
          }
        }
      } else {
        console.log("auth.activate.error.notfound");
        return res.status(202).json({
          type: "auth.activate.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("auth.activate.error.notfound");
      res.status(500).json({
        type: "auth.activate.error.notfound",
        error: error,
      });
    });
};
