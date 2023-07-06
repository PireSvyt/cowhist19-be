const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");

module.exports = userChangePassword = (req, res, next) => {
  /*
  
  enables to change password
  
  inputs
  * newpassword
  
  IMPORTANT NOTE : 
    ON PASSWORD CHANGE,
      ENCRYPTION IS DONE IN FRONTEND
      PASSWORD IS UPDATED AS IS
  
  possible response types
  * user.changepassword.success
  * user.changepassword.error.onfind
  * user.changepassword.error.notfound
  * user.changepassword.error.onsave
  * user.changepassword.error.missingnewpassword
  
  */

  console.log("user.changepassword");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ id: decodedToken.id })
    .then((user) => {
      if (user) {
        if (req.body.newpassword) {
          user.password = req.body.newpassword;
          user
            .save()
            .then(() => {
              res.status(200).json({
                type: "user.changepassword.success",
              });
            })
            .catch((error) => {
              res.status(400).json({
                type: "user.changepassword.error.onsave",
                error: error,
              });
              console.error(error);
            });
        } else {
          res.status(403).json({
            type: "user.changepassword.error.missingnewpassword",
          });
        }
      } else {
        res.status(403).json({
          type: "user.changepassword.error.notfound",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.changepassword.error.onfind",
        error: error,
      });
      console.error(error);
    });
};
