require("dotenv").config();
const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");
const Table = require("../../models/Table.js");

module.exports = adminUserDelete = (req, res, next) => {
  /*
  
  deletes a user account
  
  possible response types
  * admin.user.delete.success
  * admin.user.delete.error.onupdatetables
  * admin.user.delete.error.ondeleteuser
  
  */

  if (process.env.DEBUG) {
    console.log("user.delete");
  }

  // Delete user
  User.deleteOne({ id: req.params.id })
    .then(() => {
      // Delete user from tables
      Table.updateMany(
        { users: req.params.id },
        {
          $pullAll: {
            users: [req.params.id],
          },
        },
      )
        .then(() => {
          console.log("admin.user.delete.success");
          return res.status(200).json({
            type: "admin.user.delete.success",
          });
        })
        .catch((error) => {
          console.log("admin.user.delete.error.onupdatetables");
          console.error(error);
          return res.status(400).json({
            type: "admin.user.delete.error.onupdatetables",
            error: error,
          });
        });
    })
    .catch((error) => {
      console.log("admin.user.delete.error.ondeleteuser");
      console.error(error);
      res.status(400).json({
        type: "admin.user.delete.error.ondeleteuser",
        error: error,
      });
    });
};
