require("dotenv").config();
const Game = require("../../models/Game.js");

module.exports = gameGetOldest = (req, res, next) => {
  /*
  
  sends back the oldest game year
  
  possible response types
  * game.getoldest.success
  
  */

  if (process.env.DEBUG) {
    console.log("game.getoldest");
  }

  // Prep
  let tableid = req.params.tableid;
  if (tableid === undefined) {
    tableid = req.body.tableid;
  }

  Game.find(
    {
      $match: {
        tableid: tableid,
      },
    },
    "date"
  )
    .sort({ date: -1 })
    .limit(1)
    .then((games) => {
      if (games.length === 1) {
        console.log("game.getoldest.success");
        let gameDate = new Date(games[0].date);
        return res.status(200).json({
          type: "game.getoldest.success",
          data: {
            year: gameDate.getYear(),
          },
        });
      } else {
        console.log("game.getoldest.error.notfound");
        return res.status(101).json({
          type: "game.getoldest.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("game.getoldest.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "game.getoldest.error.onfind",
        error: error,
      });
    });
};
