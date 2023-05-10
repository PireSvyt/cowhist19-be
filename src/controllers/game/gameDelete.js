const Game = require("../models/Game.js");

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

  Game.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        type: "game.delete.success",
        message: "game deleted",
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "game.delete.errorondelete",
        message: "error on delete",
        error: error,
      });
      console.error(error);
    });
};
