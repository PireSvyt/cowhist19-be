const Game = require("../../models/Game.js");

module.exports = tableHistory = (req, res, next) => {
  /*
  
  provides a list of games sorted per date
  
  body parameters
  * need : for post processing purpose
    - list : simple list of existing fields without post processing
  * games.index : index of first to retrieve from last one (in time)
  * games.number : number of games to retrive from games.index
  
  possible response types
  * table.history.success
  * table.history.accessdenied.noneed
  * table.history.accessdenied.needmissmatch
  * table.history.error.findinggames
  
  TODO
  * only users from the table can do this
  
  */

  console.log("table.tableHistory");

  // Initialize
  var status = 500;
  var type = "table.history.error";
  var filters = {};
  var fields = "";

  // Sorting by date descending
  function compare(a, b) {
    if (a.date > b.date) {
      return -1;
    } else {
      return 1;
    }
  }

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "table.history.accessdenied.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        filters = { table: req.params.id };
        fields = "contract outcome players date";
        break;
      default:
        status = 403;
        type = "table.history.accessdenied.needmissmatch";
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
      data: {
        games: [],
      },
    });
  } else {
    // Find games
    Game.find(filters, fields)
      .then((games) => {
        games.sort(compare);
        games = games.slice(
          req.body.games.index, // from 0
          req.body.games.index + req.body.games.number, // to 10
        );
        // Check if more
        // games [ 0 ... 10 ] length = 11
        let more = games.length > req.body.games.number;
        // Shorten to desired length
        if (more) {
          games.pop();
        }
        // Response
        else status = 200;
        type = "table.history.success";
        res.status(status).json({
          type: type,
          data: {
            games: games,
            more: more,
          },
        });
      })
      .catch((error) => {
        status = 400;
        type = "table.history.error.findinggames";
        res.status(status).json({
          type: type,
          data: {
            games: [],
            more: null,
          },
          error: error,
        });
        console.error(error);
      });
  }
};
