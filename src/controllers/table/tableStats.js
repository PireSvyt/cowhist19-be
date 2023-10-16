require("dotenv").config();
const Game = require("../../models/Game.js");
const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = tableStats = (req, res, next) => {
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

  if (process.env.DEBUG) {
    console.log("table.stats");
  }

  // Find tablegames
  Game.find({ tableid: req.params.id })
    .then((games) => {
      // Post process
      let stats = serviceProcessGames(games, req.body);

      // Response
      console.log("table.stats.success");
      return res.status(200).json({
        type: "table.stats.success",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      console.log("table.stats.error");
      console.error(error);
      return res.status(400).json({
        type: "table.stats.error",
        error: error,
      });
    });
};
