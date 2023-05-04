const Game = require("../models/Game");

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
  console.log(req.body);
  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("game to create");
    // Create
    delete req.body._id;
    const game = new Game({ ...req.body });
    game.id = game._id;
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
    let game = new Game({ ...req.body });
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

  Game.aggregate([
    { $match: { 
        id: req.params.id
    } },
    { $lookup: { 
        from: 'users',
        foreignField: 'id', 
        localField: 'players._id', 
        as: 'players',
        pipeline: [
          { $project: {
            _id: 1, 
            pseudo: 1,
            role: 1,
          } }
        ]
    } },
    { $project: {
      _id: 1, 
      contract: 1, 
      players: 1, 
      outcome: 1, 
    } }
  ])
  .then((game) => {
    if (game.length === 1) {
      // Response
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "game ok",
        game: game[0],
      });
    } else {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        game: {},
      });
    }
  })
  .catch((error) => {
    status = 400; // OK
    console.error(error);
    res.status(status).json({
      status: status,
      message: "error on aggregate",
      game: {},
      error: error,
    });
  });
};

// ENABLERS
