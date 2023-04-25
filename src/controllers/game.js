const Game = require("../models/Game");

exports.save = (req, res, next) => {
  console.log("game.save");
  // Initialize
  var status = 500;
  console.log(req.body);
  // Name violation check
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("game to create");
    // Create
    delete req.body._id;
    const game = new Game({ ...req.body });
    game
      .save()
      .then(() => {
        console.log("game created");
        status = 201;
        res.status(status).json({
          status: status,
          message: "game created",
          id: game._id,
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
    let game = new Tabble({ ...req.body });
    Tabble.updateOne({ _id: game._id }, game)
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
  // TODO : delete from table
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
  console.log("game.details");
  // Initialize
  var status = 500;

  Game.findOne({ _id: req.params.id })
    .then((game) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "game ok",
        game: game,
      });
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
