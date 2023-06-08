const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");
const Table = require("../../models/Table.js");

module.exports = userDelete = (req, res, next) => {
  /*
  
  deletes a user account
  
  possible response types
  * user.delete.success
  * user.delete.error.onupdatetables
  * user.delete.error.ondeleteuser
  
  */

  console.log("user.delete");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Delete user
  User.deleteOne({ id: decodedToken.id })
    .then(() => {
      // Delete user from tables
      Table.updateMany(
        { users: decodedToken.id },
        {
          $pullAll: {
            users: [decodedToken.id],
          },
        }
      )
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
            type: "user.delete.error.onupdatetables",
            error: error,
          });
          console.error(error);
        });
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.delete.error.ondeleteuser",
        error: error,
      });
      console.error(error);
    });
};
