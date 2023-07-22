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
      if (!user) {
        // Pseudo is available
        console.log("auth.existingpseudo.false");
        res.status(200).json({
          type: "auth.existingpseudo.false",
        });
      } else {
        // Pseudo is being used
        console.log("auth.existingpseudo.true");
        res.status(403).json({
          type: "auth.existingpseudo.true",
        });
      }
    })
    .catch((error) => {
      console.log("auth.existingpseudo.error.onfind");
      res.status(500).json({
        type: "auth.existingpseudo.error.onfind",
        error: error,
      });
    });
};
