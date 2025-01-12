require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userInvite = (req, res, next) => {
  /*
  
  create invited user if not yet existing
  
  possible response types
  * user.invite.success.created
  * user.invite.success.alreadyexisting
  * user.invite.error.oncreate
  * user.invite.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("user.invite");
  }

  // User existence check
  User.findOne({ login: req.body.login }, "userid pseudo status")
    .then((user) => {
      if (user) {
        console.log("user.invite.success.alreadyexisting");
        return res.status(202).json({
          type: "user.invite.success.alreadyexisting",
          data: {
            user: user,
          },
        });
      } else {
        // User creation
        let user = new User({
          pseudo: req.body.pseudo,
          login: req.body.login,
          password: "NONE SO FAR",
          status: "invited",
          priviledges: [],
        });
        user.userid = user._id;
        // Saving
        user
          .save()
          .then(() => {
            console.log("user.invite.success.created");
            return res.status(201).json({
              type: "user.invite.success.created",
              data: {
                user: {
                  userid: user.userid,
                  pseudo: user.pseudo,
                  status: user.status,
                },
              },
            });
          })
          .catch((error) => {
            console.log("user.invite.error.oncreate");
            console.error(error);
            return res.status(400).json({
              type: "user.invite.error.oncreate",
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      console.log("user.invite.error.onfind");
      console.error(error);
      return res.status(500).json({
        type: "user.invite.error.onfind",
        error: error,
      });
    });
};
