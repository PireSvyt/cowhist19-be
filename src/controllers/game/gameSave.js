require("dotenv").config();
const Game = require("../../models/Game.js");

module.exports = gameSave = (req, res, next) => {
  /*
  
  save a game
  
  possible response types
  * game.save.success.created
  * game.save.error.oncreate
  * game.save.success.modified
  * game.save.error.onmodify
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("game.save");
  }

  if (req.body.gameid === "" || req.body.gameid === undefined) {
    // Create
    delete req.body._id;
    const gameToSave = new Game({ ...req.body });
    if (gameToSave.gameid === undefined) {
      gameToSave.gameid = gameToSave._id;
    }
    if (gameToSave.date === undefined) {
      gameToSave.date = new Date();
    }
    // Save
    gameToSave
      .save()
      .then(() => {
        console.log("game.save.success.created");
        return res.status(201).json({
          type: "game.save.success.created",
          data: {
            gameid: gameToSave.gameid,
          },
        });
      })
      .catch((error) => {
        console.log("game.save.error.oncreate");
        console.error(error);
        return res.status(400).json({
          type: "game.save.error.oncreate",
          error: error,
          data: {
            gameid: "",
          },
        });
      });
  } else {
    // Modify
    let game = new Game({ ...req.body });
    if (game.gameid === undefined) {
      game.gameid = game._id;
    }
    // Modify
    Game.updateOne({ gameid: game.gameid }, game)
      .then(() => {
        console.log("game.save.success.modified");
        return res.status(200).json({
          type: "game.save.success.modified",
          data: {
            gameid: game.gameid,
          },
        });
      })
      .catch((error) => {
        console.log("game.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "game.save.error.onmodify",
          error: error,
          data: {
            gameid: "",
          },
        });
      });
  }
};
