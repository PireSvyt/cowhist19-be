const Table = require("../../models/Table.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = tablesByPlayers = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.tablesbyplayers.success
  * admin.tablesbyplayers.error.deniedaccess
  * admin.tablesbyplayers.error.notfound
  * admin.tablesbyplayers.error.onaggregate
  
  */

  console.log("admin.tablesByPlayers");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.tablesbyplayers.error.deniedaccess",
        error: access.reason,
      });
    } else {
      Table.aggregate([
        {
          $group: {
            _id: { $size: "$users" },
            nbtables: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
        .then((tables) => {
          res.status(200).json({
            type: "admin.tablesbyplayers.success",
            data: {
              tables: tables,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.tablesbyplayers.error.onaggregate",
            error: error,
          });
          console.error(error);
        });
    }
  });
};
