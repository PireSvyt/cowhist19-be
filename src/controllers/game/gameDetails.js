const Game = require("../../models/Game.js");

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
