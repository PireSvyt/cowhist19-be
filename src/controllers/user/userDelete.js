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
          console.log("user.delete.success");
          return res.status(200).json({
            type: "user.delete.success",
          });
        })
        .catch((error) => {
          console.log("user.delete.error.onupdatetables");
          console.error(error);
          return res.status(400).json({
            type: "user.delete.error.onupdatetables",
            error: error,
          });
        });
    })
    .catch((error) => {
      console.log("user.delete.error.ondeleteuser");
      console.error(error);
      res.status(400).json({
        type: "user.delete.error.ondeleteuser",
        error: error,
      });
    });
};
