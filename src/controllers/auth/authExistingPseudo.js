const User = require("../../models/User.js");

module.exports = authExistingPseudo = (req, res, next) => {
  /*
  
  checks if a pseudo is already being used
  
  possible response types
  * auth.existingpseudo.true
  * auth.existingpseudo.false
  * auth.existingpseudo.error.onfind
  
  */

  console.log("auth.existingpseudo");

  User.findOne({ pseudo: req.body.pseudo })
    .then((user) => {
      console.log(user);
      if (user === undefined) {
        // Pseudo is available
        res.status(200).json({
          type: "auth.existingpseudo.false",
        });
      } else {
        // Pseudo is being used
        res.status(403).json({
          type: "auth.existingpseudo.true",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        type: "auth.existingpseudo.error.onfind",
        error: error,
      });
    });
};
