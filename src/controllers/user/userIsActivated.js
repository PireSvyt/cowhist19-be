require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");

module.exports = userIsActivated = (req, res, next) => {
  /*
  
  assess user status is activated
  
  possible response types
  * user.isactivated.error.notactivated
  * user.isactivated.error.notfound
  * user.isactivated.error.erroronfind
  
  */

  if (process.env.DEBUG) {
    console.log("user.isactivated");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ userid: decodedToken.userid })
    .then((user) => {
      if (user !== undefined) {
        if (user.status === "activated") {
          next();
        } else {
          console.log("user.isactivated.error.notactivated");
          return res.status(403).json({
            type: "user.isactivated.error.notactivated",
          });
        }
      } else {
        console.log("user.isactivated.error.notfound");
        return res.status(403).json({
          type: "user.isactivated.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("user.isactivated.error.erroronfind");
      console.error(error);
      return res.status(403).json({
        type: "user.isactivated.error.erroronfind",
      });
    });
};
