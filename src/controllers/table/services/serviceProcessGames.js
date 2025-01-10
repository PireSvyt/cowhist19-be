require("dotenv").config();
const serviceCheckContract = require("./serviceCheckContract.js");
const serviceGamePoints = require("./serviceGamePoints.js");

module.exports = function serviceProcessGames(games, request) {
  /*
  
  process the game list to provide stats according to request
  
  parameters
  * games to be processed
  * request.need : ranking, graph
  * request.field : if request.need is graph, precise the field to process back
    default is averagepoints
  
  */

  if (process.env.DEBUG === true) {
    console.log("table.serviceProcessGames");
  }

  // Initialize
  let upToDate = 50;
  let stats = {};
  let graph = [];

  // Sort games
  games.sort(function (first, second) {
    return first.date - second.date;
  });

  if (request.year !== undefined) {
    if (request.need === "ranking") {
      // Filter to only consider the games of that year
      games = games.filter((game) => {
        let gateDate = new Date(game.date);
        return gateDate.getYear() === request.year;
      });
    }
    if (request.need === "graph") {
      // Filtering done at the end
    }
  } else {
    if (request.need === "ranking") {
      let noYearGames = [];
      for (let g = 0; g < upToDate && g < games.length; g++) {
        noYearGames.push(games[games.length - 1 - g]);
      }
      games = noYearGames;
    }
    if (request.need === "graph") {
      let noYearGames = [];
      for (let g = 0; g < upToDate * 2 && g < games.length; g++) {
        noYearGames.push(games[games.length - 1 - g]);
      }
      games = noYearGames;
    }
  }

  // Summarize game outcomes per user
  let augmentedGames = [];
  for (let g = 0; g < games.length; g++) {
    let augmentedGame = { ...games[g] };
    // Initiate stats
    if (g === 0) {
      augmentedGame.stats = {};
    } else {
      augmentedGame.stats = {
        ...augmentedGames[augmentedGames.length - 1].stats,
      };
    }
    if (augmentedGame.contracts !== undefined) {
      augmentedGame.contracts.forEach((contract) => {
        if (serviceCheckContract(contract)) {
          let contractPoints = serviceGamePoints(contract);
          contract.players.forEach((player) => {
            // Neglect is a guest
            let nonguestplayer = true;
            if (player.nonuser !== undefined) {
              if (player.nonuser === "guest") {
                nonguestplayer = false;
              }
            }
            if (nonguestplayer) {
              // Add player to players if missing
              if (!Object.keys(augmentedGame.stats).includes(player.userid)) {
                augmentedGame.stats[player.userid] = {
                  userid: player.userid,
                  attackWins: 0,
                  attackLoss: 0,
                  defenseWins: 0,
                  defenseLoss: 0,
                  cumulatedPoints: 0,
                };
              }
              // Record outcome
              if (contract.outcome < 0) {
                if (player.role === "attack") {
                  augmentedGame.stats[player.userid].attackLoss += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                }
                if (player.role === "defense") {
                  augmentedGame.stats[player.userid].defenseWins += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                }
              } else {
                if (player.role === "attack") {
                  augmentedGame.stats[player.userid].attackWins += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                }
                if (player.role === "defense") {
                  augmentedGame.stats[player.userid].defenseLoss += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                }
              }
            }
          });
        }
      });
      if (request.year === undefined && upToDate < g) {
        // Remove outdated game
        let outdatedGame = { ...games[g - upToDate] };
        outdatedGame.contracts.forEach((outdatedContract) => {
          if (serviceCheckContract(outdatedContract)) {
            let outdatedContractPoints = serviceGamePoints(outdatedContract);
            outdatedContract.players.forEach((player) => {
              // Neglect is a guest
              let nonguestplayer = true;
              if (player.nonuser !== undefined) {
                if (player.nonuser === "guest") {
                  nonguestplayer = false;
                }
              }
              if (nonguestplayer) {
                if (outdatedContract.outcome < 0) {
                  if (player.role === "attack") {
                    augmentedGame.stats[player.userid].attackLoss -= 1;
                    augmentedGame.stats[player.userid].cumulatedPoints -=
                      outdatedContractPoints.attack;
                  }
                  if (player.role === "defense") {
                    augmentedGame.stats[player.userid].defenseWins -= 1;
                    augmentedGame.stats[player.userid].cumulatedPoints -=
                      outdatedContractPoints.defense;
                  }
                } else {
                  if (player.role === "attack") {
                    augmentedGame.stats[player.userid].attackWins -= 1;
                    augmentedGame.stats[player.userid].cumulatedPoints -=
                      outdatedContractPoints.attack;
                  }
                  if (player.role === "defense") {
                    augmentedGame.stats[player.userid].defenseLoss -= 1;
                    augmentedGame.stats[player.userid].cumulatedPoints -=
                      outdatedContractPoints.defense;
                  }
                }
                // Check if players is still in the game or did not participated enough...
                if (
                  augmentedGame.stats[player.userid].attackLoss === 0 &&
                  augmentedGame.stats[player.userid].defenseWins === 0 &&
                  augmentedGame.stats[player.userid].attackWins === 0 &&
                  augmentedGame.stats[player.userid].defenseLoss === 0
                ) {
                  delete augmentedGame.stats[player.userid];
                }
              }
            });
          }
        });
      }
      augmentedGames.push(augmentedGame);
    }
  }

  // Ranking
  if (augmentedGames.length > 0) {
    let players = neaterStats(
      statPlayers(augmentedGames[augmentedGames.length - 1].stats),
      "ranking"
    );
    let playersArray = Object.values(players);
    playersArray.sort(function (a, b) {
      let f = "averagepoints";
      if (a[f] > b[f]) {
        return -1;
      }
      if (a[f] < b[f]) {
        return 1;
      }
      return 0;
    });
    stats.ranking = playersArray;
  } else {
    stats.ranking = [];
  }

  // Additinal request
  switch (request.need) {
    case "ranking":
      // Already done
      break;
    case "graph":
      let graph = [];
      if (request.year === undefined) {
        // Only the last games matter
        for (let g = 0; g < upToDate; g++) {
          if (g < augmentedGames.length) {
            let augmentedGame = augmentedGames[augmentedGames.length - g - 1];
            graph.push({
              date: augmentedGame.date,
              players: neaterStats(
                statPlayers(augmentedGame.stats),
                "graph",
                request.field
              ),
            });
          }
        }
      } else {
        // Only the game from today minus request.year matter
        let nowDate = new Date();
        let nowYear = nowDate.getYear();
        let startYear = nowYear - request.year;
        graph = augmentedGames
          .filter((augmentedGame) => {
            let gameDate = new Date(augmentedGame.date);
            let gameYear = gameDate.getYear();
            return startYear <= gameYear;
          })
          .map((augmentedGame) => {
            return {
              date: augmentedGame.date,
              players: neaterStats(
                statPlayers(augmentedGame.stats),
                "graph",
                request.field
              ),
            };
          });
      }
      stats.graph = graph;
      break;
    default:
    // :/
  }

  return stats;
};

function statPlayers(players) {
  // Constants
  const scorev0Defense = 0.75;
  const scorev0Attack = 1.25;
  const scorev0Offset = 5;
  const scorev0Factor = 10;

  for (const [userid, player] of Object.entries(players)) {
    // Number of games
    players[userid].games =
      player.attackWins +
      player.attackLoss +
      player.defenseWins +
      player.defenseLoss;

    // Attack rate
    players[userid].rateattack =
      (player.attackWins + player.attackLoss) / player.games;

    // Win rate
    players[userid].ratevictory =
      (player.attackWins + player.defenseWins) / player.games;

    // Cowhist19 V0 score
    // 5+ROUND((0.75*defenseWins-0.75*defenseLoss+1.25*attackWins-1.25*attackLoss)/games*10,1)
    players[userid].scorev0 =
      scorev0Offset +
      scorev0Factor *
        ((scorev0Defense * (player.defenseWins - player.defenseLoss) +
          scorev0Attack * (player.attackWins - player.attackLoss)) /
          player.games);

    // Average points
    players[userid].averagepoints = player.cumulatedPoints / player.games;
  }

  return players;
}

function neaterStats(players, target, field = "averagepoints") {
  let neatPlayers = {};
  for (const [userid, player] of Object.entries(players)) {
    switch (target) {
      case "ranking":
        neatPlayers[userid] = {
          userid: player.userid,
          games: player.games,
          rateattack: player.rateattack,
          ratevictory: player.ratevictory,
          scorev0: player.scorev0,
          averagepoints: player.averagepoints,
        };
        break;
      case "graph":
        neatPlayers[userid] = player[field];
        break;
      default:
      //
    }
  }
  return neatPlayers;
}
