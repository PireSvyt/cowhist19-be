const Table = require("../../models/Table.js");
const User = require("../../models/User.js");
const Game = require("../../models/Game.js");
const serviceCheckAccess = require("./services/serviceCheckAccess.js");

module.exports = tableHistory_v3 = (req, res, next) => {
  /*
  
  provides a list of games sorted per date
  
  body parameters
  * need : for post processing purpose
    - list : simple list of existing fields without post processing
  * games.lastid : id of the last game loaded, null meaning non are loaded
  * games.number : number of games to retrive from lastid
  
  outcomes
  * type
  * data
    * games : array of games
    * more : boolean indicating if there are more games to load
    * action : string indicating if the games shall be considered as a new array or as a complementary array
        * error : error during processing
        * new : games are considered as a new payload (flush previous if any)
        * append : games complement previous if any (consolidation needed between existing and payload)
  
  possible response types
  * table.history.success
  * table.history.accessdenied.noneed
  * table.history.accessdenied.needmissmatch
  * table.history.error.findinggames
  
  */

  console.log("table.tableHistory_v3");

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
          data: {
            games: [],
            more: null,
            action: null,
          },
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
              more: null,
              action: null,
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
                      id: 1,
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
                // Find games
                Game.find(filters, fields)
                  .then((games) => {
                    games.sort(compare);
                    let action = "error";
                    // Are games already loaded
                    let lastidpos = 0;
                    if (req.body.games.lastid !== null) {
                      console.log("lastid : " + req.body.games.lastid);
                      // Find last game loaded
                      lastidpos = games.findIndex((game) => {
                        return game._id === req.body.games.lastid;
                      });
                      console.log("lastidpos : ", lastidpos);
                      if (lastidpos === -1) {
                        console.log("lastid not found");
                        // Last id not found :/
                        action = "error";
                        lastidpos = 0;
                      } else {
                        console.log("lastid pos : " + lastidpos);
                        action = "append";
                        lastidpos = lastidpos;
                      }
                    } else {
                      console.log("lastid null");
                      action = "new";
                    }
                    // Shorten payload
                    console.log(
                      "slice ",
                      lastidpos,
                      " to ",
                      lastidpos + req.body.games.number + 1
                    );
                    games = games.slice(
                      lastidpos, // from N, ex. 0
                      lastidpos + req.body.games.number + 1 // to N+M, ex. 0+10
                    );
                    console.log("games before slice : ", games);
                    // Check if more
                    // games [ N ... N+M ] length = M+1, ex. 0-10 -> 11 games
                    let more = games.length > req.body.games.number;
                    // Shorten to desired length
                    if (more) {
                      games.pop();
                    }
                    // Package data for front end
                    let newGames = [];
                    games.forEach((game) => {
                      let newGame = JSON.parse(JSON.stringify(game));
                      newGame.attack = [];
                      newGame.defense = [];
                      newGame.players.forEach((player) => {
                        let gamePlayer = JSON.parse(JSON.stringify(player));
                        if (gamePlayer.nonuser === undefined) {
                          gamePlayer.nonuser = "na";
                        }
                        if (gamePlayer.nonuser !== "guest") {
                          // User is not a guest
                          let potentialPseudo = table.players.filter(
                            (tablePlayer) => tablePlayer.id === gamePlayer._id
                          );
                          if (potentialPseudo.length > 0) {
                            // User is part of the table players
                            gamePlayer.pseudo = potentialPseudo[0].pseudo;
                          } else {
                            // User is no longer part of the table players
                            gamePlayer.nonuser = "removeduser";
                          }
                        }
                        delete gamePlayer.id;
                        delete gamePlayer.role;
                        newGame[player.role].push(gamePlayer);
                      });
                      // Remove players
                      delete newGame.players;
                      newGames.push(newGame);
                    });
                    // Response
                    res.status(200).json({
                      type: "table.history.success",
                      data: {
                        games: newGames,
                        more: more,
                        action: action,
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
                        action: null,
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
                    action: null,
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
                  action: null,
                },
                error: error,
              });
            });
        }
      }
    }
  );
};
