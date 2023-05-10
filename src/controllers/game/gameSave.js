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

  console.log("game.save");

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    // Create
    delete req.body._id;
    const gameToSave = new Game({ ...req.body });
    gameToSave.id = gameToSave._id;
    gameToSave.date = new Date();
    // Save
    gameToSave
      .save()
      .then(() => {
        res.status(201).json({
          type: "game.save.success.created",
          message: "game created",
          data: {
            id: gameToSave._id,
          },
        });
      })
      .catch((error) => {
        res.status(400).json({
          type: "game.save.error.oncreate",
          message: "error on create",
          error: error,
          data: {
            id: "",
          },
        });
        console.error(error);
      });
  } else {
    // Modify
    let game = new Game({ ...req.body });
    game.id = game._id;
    // Modify
    Game.updateOne({ _id: game._id }, game)
      .then(() => {
        res.status(200).json({
          type: "game.save.success.modified",
          message: "game modified",
          data: {
            id: game.id,
          },
        });
      })
      .catch((error) => {
        res.status(400).json({
          type: "game.save.error.onmodify",
          message: "error on modify",
          error: error,
          data: {
            id: "",
          },
        });
        console.error(error);
      });
  }
};
