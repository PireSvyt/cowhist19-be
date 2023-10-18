require("dotenv").config();
const Game = require("../../models/Game.js");

module.exports = gameGet = (req, res, next) => {
  /*
  
  sends back the game
  
  possible response types
  * game.get.success
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("game.get");
  }

  Game.findOne({ gameid: req.params.id }, "tableid contract outcome players")
    .then((game) => {
      if (game !== undefined) {
        console.log("game.get.success");
        return res.status(200).json({
          type: "game.get.success",
          data: {
            game: game,
          },
        });
      } else {
        console.log("game.get.error.notfound");
        return res.status(101).json({
          type: "game.get.error.notfound",
          data: {
            game: {},
          },
        });
      }
    })
    .catch((error) => {
      console.log("game.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "game.get.error.onfind",
        error: error,
        data: {
          game: {},
        },
      });
    });
};
