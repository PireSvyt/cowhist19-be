const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");

module.exports = adminAuthenticate = (req, res, next) => {
  /*
  
  authenticate the user as an admin
  
  possible response types
  * admin.authenticate.error.isnotadmin
  * admin.authenticate.error.notfound
  * admin.authenticate.error.erroronfind
  
  */

  console.log("admin.authenticate");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ _id: decodedToken.id })
    .then((user) => {
      if (user !== undefined) {
        if (user.priviledges.includes("admin")) {
          req.user = user;
          next();
        } else {
          return res.status(403).json({
            type: "admin.authenticate.error.isnotadmin",
            error: err,
          });
        }
      } else {
        return res.status(403).json({
          type: "admin.authenticate.error.notfound",
          error: err,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({
        type: "admin.authenticate.error.erroronfind",
        error: err,
      });
    });
};
