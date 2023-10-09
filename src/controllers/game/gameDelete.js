require("dotenv").config();
const Game = require("../../models/Game.js");

module.exports = gameDelete = (req, res, next) => {
  /*
  
  delete a game
  
  possible response types
  * game.delete.success
  * game.delete.error.ondelete
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("game.delete");
  }

  Game.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log("game.delete.success");
      return res.status(200).json({
        type: "game.delete.success",
      });
    })
    .catch((error) => {
      console.log("game.delete.error.ondelete");
      console.error(error);
      return res.status(400).json({
        type: "game.delete.error.ondelete",
        error: error,
      });
    });
};
