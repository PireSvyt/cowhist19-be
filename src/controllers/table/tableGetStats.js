require("dotenv").config();
const Game = require("../../models/Game.js");
const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = tableGetStats = (req, res, next) => {
  /*
  
  provides the stats according to given parameters
  
  body parameters are transfered to the processGames function 
  
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
      let stats = serviceProcessGames(games, req.body);

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
