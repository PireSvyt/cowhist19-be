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
              console.log("user.changepassword.success");
              return res.status(200).json({
                type: "user.changepassword.success",
              });
            })
            .catch((error) => {
              console.log("user.changepassword.error.onsave");
              console.error(error);
              return res.status(400).json({
                type: "user.changepassword.error.onsave",
                error: error,
              });
            });
        } else {
          console.log("user.changepassword.error.missingnewpassword");
          return res.status(403).json({
            type: "user.changepassword.error.missingnewpassword",
          });
        }
      } else {
        console.log("user.changepassword.error.notfound");
        return res.status(403).json({
          type: "user.changepassword.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("user.changepassword.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "user.changepassword.error.onfind",
        error: error,
      });
    });
};
