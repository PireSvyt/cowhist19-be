const Table = require("../../models/Table.js");
const User = require("../../models/User.js");
const Game = require("../../models/Game.js");
const serviceCheckAccess = require("./services/serviceCheckAccess.js");

module.exports = tableHistory_v2 = (req, res, next) => {
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

  console.log("table.tableHistory_v2");

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

  // Check access
  serviceCheckAccess(req.params.id, req.headers["authorization"]).then(
    (access) => {
      if (!access.outcome) {
        // Unauthorized
        res.status(401).json({
          type: "table.history.error.deniedaccess",
          error: access.reason,
        });
      } else {
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
          // Find users from table
          Table.aggregate([
            {
              $match: {
                id: req.params.id,
              },
            },
            {
              $lookup: {
                from: "users",
                foreignField: "id",
                localField: "users",
                as: "players",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      pseudo: 1,
                      status: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                guests: 1,
                players: 1,
              },
            },
          ])
            .then((tables) => {
              if (tables.length === 1) {
                let table = tables[0];
                console.log("table");
                console.log(table);
                // Find games
                Game.find(filters, fields)
                  .then((games) => {
                    games.sort(compare);
                    games = games.slice(
                      req.body.games.index, // from 0
                      req.body.games.index + req.body.games.number // to 10
                    );
                    // Check if more
                    // games [ 0 ... 10 ] length = 11
                    let more = games.length > req.body.games.number;
                    // Shorten to desired length
                    if (more) {
                      games.pop();
                    }
                    console.log("games");
                    console.log(games);
                    // Package data for front end
                    let newGames = [];
                    games.forEach((game) => {
                      //let newGame = { ...game };
                      game.attackPlayers = [];
                      game.defensePlayers = [];
                      console.log("game");
                      console.log(game);
                      game.players.forEach((player) => {
                        let newPlayer = { ...player };
                        if (newPlayer.noneuser === undefined) {
                          newPlayer.noneuser = [];
                        }
                        console.log("newPlayer");
                        console.log(newPlayer);
                        if (!newPlayer.noneuser.includes("guest")) {
                          // User is not a guest
                          let potentialPseudo = table.players.filter((p) => {
                            return p._id === newPlayer._id;
                          });
                          if (potentialPseudo.length > 0) {
                            // User is part of the table players
                            newPlayer.pseudo = potentialPseudo[0];
                          } else {
                            // User is no longer part of the table players
                            newPlayer.noneuser.push("removeduser");
                          }
                        }
                        game[newPlayer.role + "Players"].push(newPlayer);
                      });
                      console.log("game");
                      console.log(game);
                      //console.log("newGame");
                      //console.log(newGame);
                      //newGames.push(newGame);
                    });
                    console.log("newGames");
                    console.log(newGames);
                    // Response
                    res.status(200).json({
                      type: "table.history.success",
                      data: {
                        games: newGames,
                        more: more,
                      },
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    res.status(400).json({
                      type: "table.history.error.findinggames",
                      data: {
                        games: [],
                        more: null,
                      },
                      error: error,
                    });
                  });
              } else {
                res.status(400).json({
                  type: "table.history.error.onfindtable",
                  data: {
                    games: [],
                    more: null,
                  },
                });
              }
            })
            .catch((error) => {
              console.error(error);
              res.status(400).json({
                type: "table.history.error.onaggregate",
                data: {
                  games: [],
                  more: null,
                },
                error: error,
              });
            });
        }
      }
    }
  );
};
