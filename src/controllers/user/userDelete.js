const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");

module.exports = userDelete = (req, res, next) => {
  /*
  
  deletes a user account
  
  possible response types
  * user.delete.success
  * user.delete.error.notfound
  
  */

  console.log("user.delete");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Delete user
  User.deleteOne({ id: decodedToken.id })
    .then(() => {
      if (process.env.NODE_ENV !== "_production") {
        console.log("user.delete success");
      }
      res.status(200).json({
        type: "user.delete.success",
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.delete.errorondelete",
        error: error,
      });
      console.error(error);
    });
};
