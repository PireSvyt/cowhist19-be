const User = require("../../models/User.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = usersByStatus = (req, res, next) => {
  /*
  
  provides user details reporting
  
  NOTE : removes field password
  
  possible response types
  * admin.usersbystatus.success
  * admin.usersbystatus.error.deniedaccess
  * admin.usersbystatus.error.notfound
  * admin.usersbystatus.error.onaggregate
  
  */

  console.log("admin.usersByStatus");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.usersbystatus.error.deniedaccess",
        error: access.reason,
      });
    } else {
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
    }
  });
};
