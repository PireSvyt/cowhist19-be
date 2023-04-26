const Game = require("../models/Game");
const User = require("../models/User");

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
  // Prep
  var users = [];
  req.body.users.forEach((user) => {
    delete user.name;
  });
  req.body.users = users;
  // Save
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
  Game.findOne({ _id: req.params.id })
    .then((game) => {
      if (game !== undefined) {
        // Prep
        const getUsersRes = getUsers(game);
        game.users = getUsersRes.users;
        if (getUsersRes.status === 200) {
          status = 200; // OK
          message = "game ok";
        } else {
          status = getUsersRes.status;
          message = getUsersRes.message;
        }
        // Send
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
async function getUsers(game) {
  /*
  enabler retrieving a dict of users belonging to the game
  adds
  * name
  
  */
  console.log("game.getUsers");
  game.users.forEach((rawuser) => {
    User.findById(rawuser.id)
      .then((user) => {
        // Prep
        rawuser.name = user.name;
      })
      .catch((error) => {
        console.error(error);
        return {
          status: 400,
          message: "error on find user by id",
          users: [],
          error: error,
        };
      });
  });
  return {
    status: 200,
    message: "users ok",
    users: game.users,
    error: error,
  };
}
