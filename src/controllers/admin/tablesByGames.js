const Table = require("../../models/Table.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = tablesByGames = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.tablesbygames.success
  * admin.tablesbygames.error.deniedaccess
  * admin.tablesbygames.error.notfound
  * admin.tablesbygames.error.onaggregate
  
  */

  console.log("admin.tablesByGames");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.tablesbygames.error.deniedaccess",
        error: access.reason,
      });
    } else {
      Table.aggregate([
        {
          $lookup: {
            from: "games",
            foreignField: "table",
            localField: "id",
            as: "games",
          },
        },
        {
          $group: {
            _id: { $size: "$games" },
            nbtables: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
        .then((tables) => {
          res.status(200).json({
            type: "admin.tablesbygames.success",
            data: {
              tables: tables,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.tablesbygames.error.onaggregate",
            error: error,
          });
          console.error(error);
        });
    }
  });
};
