require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Game = require("../../models/Game.js");

const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = userGetStats = (req, res, next) => {
  /*
  
  provides user statistics
  * number of played games
  * rate of victory
  * rate of attack
  
  possible response types
  * user.getstats.success
  * user.getstats.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("user.getstats");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);
  Game.find({
    contracts: {
      $elemMatch: {
        players: {
          $elemMatch: {
            userid: decodedToken.userid,
          },
        },
      },
    },
  })
    .then((games) => {
      // Post process
      let stats = serviceProcessGames(games, decodedToken.userid);

      // Response
      console.log("user.getstats.success");
      return res.status(200).json({
        type: "user.getstats.success",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      console.log("user.getstats.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "user.getstats.error.onfind",
        error: error,
      });
    });
};
