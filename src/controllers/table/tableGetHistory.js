require("dotenv").config();
const Table = require("../../models/Table.js");
const Game = require("../../models/Game.js");

module.exports = tableGetHistory = (req, res, next) => {
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
  * table.gethistory.success
  * table.gethistory.accessdenied.noneed
  * table.gethistory.accessdenied.needmissmatch
  * table.gethistory.error.findinggames
  
  */

  if (process.env.DEBUG) {
    console.log("table.tableGetHistory");
  }

  // Initialize
  var status = 500;
  var type = "table.gethistory.error";
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
    type = "table.gethistory.accessdenied.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        filters = { tableid: req.params.tableid };
        fields = "gameid contracts outcome date";
        break;
      default:
        status = 403;
        type = "table.gethistory.accessdenied.needmissmatch";
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
          tableid: req.params.tableid,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "userid",
          localField: "users",
          as: "players",
          pipeline: [
            {
              $project: {
                userid: 1,
                pseudo: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          tableid: 1,
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
              if (req.body.games.lastid !== undefined) {
                // Find last game loaded
                lastidpos = games.findIndex((game) => {
                  return game.gameid === req.body.games.lastid;
                });
                if (lastidpos === -1) {
                  // Last id not found :/
                  action = "error";
                  lastidpos = 0;
                } else {
                  action = "append";
                  lastidpos = lastidpos + 1;
                }
              } else {
                action = "new";
              }
              // Shorten payload
              games = games.slice(
                lastidpos, // from N, ex. 0
                lastidpos + req.body.games.number + 1, // to N+M, ex. 0+10
              );
              // Check if more
              // games [ N ... N+M ] length = M+1, ex. 0-10 -> 11 games
              let more = games.length > req.body.games.number;
              // Shorten to desired length
              if (more === true) {
                games.pop();
              }
              // Package data for front end
              let newGames = [];
              games.forEach((game) => {
                let newGame = JSON.parse(JSON.stringify(game));
                newGame.contracts = [];
                game.contracts.forEach((contract) => {
                  let newContract = JSON.parse(JSON.stringify(contract));
                  newContract.attack = [];
                  newContract.defense = [];
                  newContract.players.forEach((player) => {
                    let contractPlayer = JSON.parse(JSON.stringify(player));
                    if (contractPlayer.nonuser === undefined) {
                      contractPlayer.nonuser = "na";
                    }
                    if (contractPlayer.nonuser !== "guest") {
                      // User is not a guest
                      let potentialPseudo = table.players.filter(
                        (tablePlayer) =>
                          tablePlayer.userid === contractPlayer.userid,
                      );
                      if (potentialPseudo.length > 0) {
                        // User is part of the table players
                        contractPlayer.pseudo = potentialPseudo[0].pseudo;
                      } else {
                        // User is no longer part of the table players
                        contractPlayer.nonuser = "removeduser";
                      }
                    } else {
                      // User is a guest
                      contractPlayer.pseudo = "a guest";
                    }
                    delete contractPlayer.role;
                    delete newGame.players;
                    newContract[player.role].push(contractPlayer);
                  });
                  newGame.contracts.push(newContract);
                });
                newGames.push(newGame);
              });

              // Response
              console.log("table.gethistory.success");
              return res.status(200).json({
                type: "table.gethistory.success",
                data: {
                  games: newGames,
                  more: more,
                  action: action,
                },
              });
            })
            .catch((error) => {
              console.log("table.gethistory.error.findinggames");
              console.error(error);
              return res.status(400).json({
                type: "table.gethistory.error.findinggames",
                error: error,
              });
            });
        } else {
          console.log("table.gethistory.error.onfindtable");
          return res.status(400).json({
            type: "table.gethistory.error.onfindtable",
          });
        }
      })
      .catch((error) => {
        console.log("table.gethistory.error.onaggregate");
        console.error(error);
        res.status(400).json({
          type: "table.gethistory.error.onaggregate",
          error: error,
        });
      });
  }
};
