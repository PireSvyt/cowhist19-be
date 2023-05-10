const User = require("../../models/User.js");

module.exports = userInvite = (req, res, next) => {
  /*
  
  create invited user if not yet existing
  
  possible response types
  * user.invite.success.created
  * user.invite.success.alreadyexisting
  
  */
  
  console.log("user.invite");
  
  // User existence check
  User.findOne({ login: req.body.login }, "pseudo status")
    .then((user) => {
      if (user) {
          
        return res.status(202).json({
          type: "user.invite.success.alreadyexisting",
          message: "utilisateur déjà existant",
          data : {
              user: user}
        });
      } else {
        // User creation
        let user = new User({
          pseudo: req.body.pseudo,
          login: req.body.login,
          password: "NONE SO FAR",
          status: "invited",
        });
        user.id = user._id;
        // Saving
        user
          .save()
          .then(() => {
            res.status(201).json({
          type: "user.invite.success.created",
              message: "ustilisateur créé",
              user: {
                _id: user._id,
                pseudo: user.pseudo,
                status: user.status,
              },
            });
          })
          .catch((error) => {
            res.status(400).json({
          type: "user.invite.error.oncreate",
              message: "erreur lors de la création",
              error,
              user: {
                _id: "",
                pseudo: "",
                status: "",
              },
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
          type: "user.invite.error.onfind",
        message: "erreur lors du check d'existance",
        error,
        user: {
                _id: "",
                pseudo: "",
                status: "",
              },
      });
    });
};