require("dotenv").config();
const Game = require("../../models/Game.js");
const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = tableGetStats = (req, res, next) => {
  /*
  
  provides the stats according to given parameters
  
  body parameters are transfered to the processGames function 

  parameters
  * need : ranking or graph
  * year : optional field to get the stats over a certain year or sliding period
  
  possible response types
  * table.getstats.success
  * table.getstats.error
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */

  if (process.env.DEBUG) {
    console.log("table.getstats");
  }

  // Find tablegames
  Game.find({ tableid: req.params.tableid })
    .then((games) => {
      // Post process
      let stats;
      if (games.length === 0) {
        stats = {
          ranking: [],
        };
      } else {
        stats = serviceProcessGames(req.augmented.table, games, req.body);
      }

      // Response
      console.log("table.getstats.success");
      return res.status(200).json({
        type: "table.getstats.success",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      console.log("table.getstats.error");
      console.error(error);
      return res.status(400).json({
        type: "table.getstats.error",
        error: error,
      });
    });
};
