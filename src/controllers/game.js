const Game = require("../models/Game.js");

exports.save = (req, res, next) => {
  /*
  
  TODO
  * check table id existance
  * check user ids existance
  * only users from the table can do this
  
  */
  console.log("game.save");
  // Initialize
  var status = 500;

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("game to create");
    // Create
    delete req.body._id;
    const gameToSave = new Game({ ...req.body });
    gameToSave.id = gameToSave._id;
    gameToSave.date = new Date();
    console.log("gameToSave");
    console.log(gameToSave);
    gameToSave
      .save()
      .then(() => {
        console.log("game created");
        status = 201;
        res.status(status).json({
          status: status,
          message: "game created",
          id: gameToSave._id,
        });
      })
      .catch((error) => {
        console.log("error on create");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on create",
          error: error,
          game: req.body,
        });
      });
  } else {
    // Modify
    console.log("game to modify");
    console.log(req.body);
    let game = new Game({ ...req.body });
    game.id = game._id;
    Game.updateOne({ _id: game._id }, game)
      .then(() => {
        console.log("game modified");
        status = 200;
        res.status(status).json({
          status: status,
          message: "game modified",
          id: req.body.id,
        });
      })
      .catch((error) => {
        console.log("error on modified");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          game: req.body,
        });
        console.error(error);
      });
  }
};

exports.delete = (req, res, next) => {
  /*
  
  TODO
  * only users from the table can do this
  
  */
  console.log("game.delete");
  // Initialize
  var status = 500;
  Game.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "game deleted",
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        game: req.body,
      });
      console.error(error);
    });
};

exports.details = (req, res, next) => {
  /*
  
  TODO
  * only users from the table can do this
  
  */
  console.log("game.details");
  // Initialize
  var status = 500;
  var message = "";

  Game.findOne({ _id: req.params.id }, "table contract outcome players")
    .then((game) => {
      if (game !== undefined) {
        status = 200;
        res.status(status).json({
          status: status,
          message: message,
          game: game,
        });
      } else {
        status = 101; // Inexisting
        res.status(status).json({
          status: status,
          message: "inexisting game",
          game: {},
        });
      }
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        game: {},
        error: error,
      });
      console.error(error);
    });
};

// ENABLERS
