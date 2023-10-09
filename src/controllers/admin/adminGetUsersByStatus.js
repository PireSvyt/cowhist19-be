require("dotenv").config();
const User = require("../../models/User.js");

module.exports = adminGetUsersByStatus = (req, res, next) => {
  /*
  
  provides user details reporting
  
  NOTE : removes field password
  
  possible response types
  * admin.usersbystatus.success
  * admin.usersbystatus.error.deniedaccess
  * admin.usersbystatus.error.notfound
  * admin.usersbystatus.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("admin.usersByStatus");
  }

  User.aggregate([
    {
      $group: {
        _id: "$status",
        nbusers: { $sum: 1 },
      },
    },
    {
      $sort: { nbusers: 1 },
    },
  ])
    .then((users) => {
      res.status(200).json({
        type: "admin.usersbystatus.success",
        data: {
          users: users,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "admin.usersbystatus.error.onaggregate",
        error: error,
      });
      console.error(error);
    });
};
