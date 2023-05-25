const Game = require("../../models/Game.js");
const serviceCheckAccess = require("../table/services/serviceCheckAccess.js");

module.exports = gameDetails = (req, res, next) => {
  /*
  
  sends back the game details
  
  possible response types
  * game.details.success
  
  TODO
  * only users from the table can do this
  
  */

  console.log("game.details");

  Game.findOne({ _id: req.params.id }, "table contract outcome players")
    .then((game) => {
      // Check access
      serviceCheckAccess(game.table, req.headers["authorization"]).then(
        (access) => {
          if (!access.outcome) {
            // Unauthorized
            res.status(401).json({
              type: "game.details.error.deniedaccess",
              error: access.reason,
            });
          } else {
            if (game !== undefined) {
              res.status(200).json({
                type: "game.details.success",
                data: {
                  game: game,
                },
              });
            } else {
              res.status(101).json({
                type: "game.details.error.notfound",
                data: {
                  game: {},
                },
              });
            }
          }
        }
      );
    })
    .catch((error) => {
      res.status(400).json({
        type: "game.details.error.onfind",
        error: error,
        data: {
          game: {},
        },
      });
      console.error(error);
    });
};
