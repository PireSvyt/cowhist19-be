const User = require("../../models/User.js");
const Table = require("../../models/Table.js");
const Game = require("../../models/Game.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = objectCount = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.objectcount.success
  * admin.objectcount.error.deniedaccess
  * admin.objectcount.error.oncountusers
  * admin.objectcount.error.oncounttables
  * admin.objectcount.error.oncountgames
  
  */

  console.log("admin.objectcount");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.objectcount.error.deniedaccess",
        error: access.reason,
      });
    } else {
      User.count()
        .then((users) => {
          Table.count()
            .then((tables) => {
              Game.count()
                .then((games) => {
                  res.status(200).json({
                    type: "admin.objectcount.success",
                    data: {
                      users: users,
                      tables: tables,
                      games: games,
                    },
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    type: "admin.objectcount.error.oncountgames",
                    error: error,
                  });
                  console.error(error);
                });
            })
            .catch((error) => {
              res.status(400).json({
                type: "admin.objectcount.error.oncounttables",
                error: error,
              });
              console.error(error);
            });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.objectcount.error.oncountusers",
            error: error,
          });
          console.error(error);
        });
    }
  });
};
