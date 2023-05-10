const Game = require("../../models/Game.js");
const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = stats = (req, res, next) => {
  /*
  
  provides the stats according to given parameters
  
  body parameters are transfered to the processGames function 
  
  possible response types
  * table.stats.success
  * table.stats.error
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */

  console.log("table.stats");

  // Find tablegames
  Game.find({ table: req.params.id })
    .then((games) => {
      // Post process
      let stats = serviceProcessGames(games, req.body);

      // Response
      res.status(200).json({
        type: "table.stats.success",
        message: "stats ok",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        type: "table.stats.error",
        message: "error on find",
        error: error,
        data: {
          stats: {},
        },
      });
    });
};
