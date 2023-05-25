const Game = require("../../models/Game.js");
const serviceCheckAccess = require("../table/services/serviceCheckAccess.js");

module.exports = gameDelete = (req, res, next) => {
  /*
  
  delete a game
  
  possible response types
  * game.delete.success
  * game.delete.errorondelete
  
  TODO
  * only users from the table can do this
  
  */

  console.log("game.delete");

  Game.findOne({ _id: req.params.id }, "table contract outcome players").then(
    (game) => {
      // Check access
      serviceCheckAccess(game.table, req.headers["authorization"]).then(
        (access) => {
          if (!access.outcome) {
            // Unauthorized
            res.status(401).json({
              type: "game.delete.error.deniedaccess",
              error: access.reason,
            });
          } else {
            // Delete
            Game.deleteOne({ _id: req.params.id })
              .then(() => {
                res.status(200).json({
                  type: "game.delete.success",
                });
              })
              .catch((error) => {
                res.status(400).json({
                  type: "game.delete.errorondelete",
                  error: error,
                });
                console.error(error);
              });
          }
        }
      );
    }
  );
};
