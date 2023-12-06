require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Game = require("../../models/Game.js");

module.exports = gameCreate = (req, res, next) => {
  /*
  
  create a game
  
  possible response types
  * game.create.success
  * game.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("game.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

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
      console.log("game.create.success");
      return res.status(201).json({
        type: "game.create.success",
        data: {
          gameid: gameToSave.gameid,
        },
      });
    })
    .catch((error) => {
      console.log("game.create.error");
      console.error(error);
      return res.status(400).json({
        type: "game.create.error",
        error: error,
        data: {
          gameid: "",
        },
      });
    });
};
