const jwt_decode = require("jwt-decode");
const Game = require("../../models/Game.js");

const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = userStats = (req, res, next) => {
  /*
  
  provides user statistics
  * number of played games
  * rate of victory
  * rate of attack
  
  possible response types
  * user.stats.success
  * user.stats.error.onfind
  
  */

  console.log("user.stats");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  Game.find({ players: decodedToken.id })
    .then((games) => {
      // Post process
      let stats = serviceProcessGames(games, decodedToken.id);

      // Response
      res.status(200).json({
        type: "user.stats.success",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.stats.error.onfind",
        error: error,
        data: {
          stats: {},
        },
      });
      console.error(error);
    });
};
