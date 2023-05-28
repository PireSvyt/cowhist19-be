const Game = require("../../models/Game.js");
const Table = require("../../models/Table.js");
const serviceCheckAccess = require("./services/serviceCheckAccess.js");
const serviceTableDelete = require("./services/serviceTableDelete.js");

module.exports = tableDelete = (req, res, next) => {
  /*
  
  deletes a table
  
  possible response types
  * table.delete.success
  * table.delete.error.ondeletegames
  * table.delete.error.ondeletetable
  
  TODO
  * only users from the table can do this
  
  */

  console.log("table.delete");

  // Check access
  serviceCheckAccess(req.params.id, req.headers["authorization"]).then(
    (access) => {
      if (!access.outcome) {
        // Unauthorized
        res.status(401).json({
          type: "table.delete.error.deniedaccess",
          error: access.reason,
        });
      } else {
        // Delete table's games
        Game.deleteMany({ table: req.params.id }).catch((error) => {
          res.status(400).json({
            type: "table.delete.error.ondeletegames",
            error: error,
          });
          console.error(error);
        });

        // Delete table
        serviceTableDelete(req.params.id)
          .then((deleteOutcome) => {
            if (deleteOutcome.outcome === "table.delete.success") {
              res.status(200).json({
                type: "table.delete.success",
              });
            } else {
              res.status(500).json({
                type: "table.delete.error",
                error: deleteOutcome.error,
              });
            }
          })
          .catch((error) => {
            res.status(400).json({
              type: "table.delete.error.ondeletetable",
              error: error,
            });
            console.error(error);
          });
      }
    }
  );
};
