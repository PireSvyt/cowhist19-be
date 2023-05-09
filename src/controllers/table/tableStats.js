const Game = require("../../models/Game.js");
const serviceProcessGames = require("./services/serviceProcessGames.js");

module.exports = stats = (req, res, next) => {
  /*
  
  provides the stats according to given parameters
  
  body parameters are transfered to the processGames function 
  
  possible response types
  * table.save.success
  * table.stats.error
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */

  console.log("table.stats");

  // Initialize
  var status = 500;
  var type = "table.stats.error";

  // Find tablegames
  Game.find({ table: req.params.id })
    .then((games) => {
      // Post process
      let stats = serviceProcessGames(games, req.body);

      // Response
      status = 200; // OK
      type = "table.stats.success";
      res.status(status).json({
        type: type,
        message: "stats ok",
        data: {
          stats: stats,
        },
      });
    })
    .catch((error) => {
      status = 400;
      type = "table.stats.error";
      console.error(error);
      res.status(status).json({
        type: type,
        message: "error on find",
        error: error,
        data: {
          stats: {},
        },
      });
    });
};
