require("dotenv").config();
const serviceCheckContract = require("./serviceCheckContract.js");
const serviceGamePoints = require("./serviceGamePoints.js");

module.exports = function serviceProcessGames(table, games, request) {
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

  debug = true;

  // Initialize
  let stats = {};
  games = docGames(games);

  games = sortGames(games);
  if (debug) {
    console.log("sorted games", games);
  }

  games = filterGames(table, request, games);
  if (debug) {
    console.log("filtered games", games);
  }

  games = augmentGames(table, request, games);
  if (debug) {
    console.log("augmented games", games);
  }

  games = reverseGames(games);
  if (debug) {
    console.log("reversed games", games);
  }

  switch (request.need) {
    case "ranking":
      stats.ranking = sortRanking(
        Object.values(computeRankingFromGames(games))
      );
      if (debug) {
        console.log("stats.ranking", stats.ranking);
      }
      break;
    case "graph":
      stats.graph = computeGraph(table, request, games);
      stats.ranking = sortRanking(
        Object.values(stats.graph[stats.graph.length - 1].players)
      );
      if (debug) {
        console.log("stats.graph", stats.graph);
      }
      break;
  }

  return stats;
};

function docGames(games) {
  newGames = [];
  games.forEach((game) => {
    newGames.push(game._doc);
  });
  return newGames;
}

function sortGames(games) {
  let newGames = [...games];
  newGames.sort(function (first, second) {
    return first.date - second.date;
  });
  return newGames;
}

function reverseGames(games) {
  let newGames = [];
  games.forEach((game) => {
    newGames.unshift(game);
  });
  return newGames;
}

function filterGames(table, request, games) {
  newGames = [];

  if (request.year !== undefined) {
    if (request.need === "ranking") {
      // Filter to only consider the games of that year
      newGames = games.filter((game) => {
        let gateDate = new Date(game.date);
        return gateDate.getYear() + 1900 === request.year;
      });
    }
    if (request.need === "graph") {
      // Filtering games from requested year
      newGames = games.filter((game) => {
        let gateDate = new Date(game.date);
        return gateDate.getYear() + 1900 === request.year;
      });
    }
  } else {
    if (request.need === "ranking") {
      for (let g = 0; g < table.statsGameNumber && g < games.length; g++) {
        newGames.push(games[games.length - 1 - g]);
      }
    }
    if (request.need === "graph") {
      for (let g = 0; g < table.statsGameNumber * 2 && g < games.length; g++) {
        newGames.push(games[games.length - 1 - g]);
      }
    }
  }

  return newGames;
}

function augmentGames(table, request, games) {
  let augmentedGames = [];
  games.forEach((game) => {
    let augmentedGame = { ...game };

    // Initiate stats
    if (augmentedGames.length === 0) {
      augmentedGame.stats = {};
      augmentedGame.graph = {};
    } else {
      augmentedGame.stats = {
        ...augmentedGames[augmentedGames.length - 1].stats,
      };
      augmentedGame.graph = {};
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
              // Graph
              augmentedGame.graph[player.userid] = {
                userid: player.userid,
                attackWins: 0,
                attackLoss: 0,
                defenseWins: 0,
                defenseLoss: 0,
                cumulatedPoints: 0,
              };
              // Record outcome
              if (contract.outcome < 0) {
                if (player.role === "attack") {
                  augmentedGame.stats[player.userid].attackLoss += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                  augmentedGame.graph[player.userid].attackLoss += 1;
                  augmentedGame.graph[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                }
                if (player.role === "defense") {
                  augmentedGame.stats[player.userid].defenseWins += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                  augmentedGame.graph[player.userid].defenseWins += 1;
                  augmentedGame.graph[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                }
              } else {
                if (player.role === "attack") {
                  augmentedGame.stats[player.userid].attackWins += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                  augmentedGame.graph[player.userid].attackWins += 1;
                  augmentedGame.graph[player.userid].cumulatedPoints +=
                    contractPoints.attack;
                }
                if (player.role === "defense") {
                  augmentedGame.stats[player.userid].defenseLoss += 1;
                  augmentedGame.stats[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                  augmentedGame.graph[player.userid].defenseLoss += 1;
                  augmentedGame.graph[player.userid].cumulatedPoints +=
                    contractPoints.defense;
                }
              }
            }
          });
        }
      });
    }

    augmentedGames.push(augmentedGame);
  });

  return augmentedGames;
}

function sortRanking(ranking) {
  ranking.sort(function (a, b) {
    let f = "averagepoints";
    if (a[f] > b[f]) {
      return -1;
    }
    if (a[f] < b[f]) {
      return 1;
    }
    return 0;
  });
  return ranking;
}

function computeRankingFromGames(rankingGames) {
  let ranking = {};
  rankingGames.forEach((rankingGame) => {
    Object.keys(rankingGame.graph).forEach((playerid) => {
      if (!Object.keys(ranking).includes(playerid)) {
        ranking[playerid] = rankingGame.graph[playerid];
      } else {
        Object.keys(rankingGame.graph[playerid]).forEach((statKey) => {
          if (statKey != "userid") {
            ranking[playerid][statKey] += rankingGame.graph[playerid][statKey];
          }
        });
      }
    });
  });
  // Metrics
  Object.keys(ranking).forEach((playerid) => {
    ranking[playerid].games =
      ranking[playerid].attackLoss +
      ranking[playerid].attackWins +
      ranking[playerid].defenseLoss +
      ranking[playerid].defenseWins;
    ranking[playerid].averagepoints =
      ranking[playerid].cumulatedPoints / ranking[playerid].games;
    ranking[playerid].rateattack =
      (ranking[playerid].attackLoss + ranking[playerid].attackWins) /
      ranking[playerid].games;
    ranking[playerid].ratevictory =
      (ranking[playerid].attackWins + ranking[playerid].defenseWins) /
      ranking[playerid].games;
  });
  return ranking;
}

function computeGraph(table, request, games) {
  graph = [];

  if (request.year === undefined) {
    // Only the last games matter
    for (let g = 0; g < table.statsGameNumber && g < games.length; g++) {
      graph.push({
        date: games[g].date,
        players: computeRankingFromGames(games.slice(g, table.statsGameNumber)),
      });
    }
  } else {
    for (let g = 0; g < games.length; g++) {
      graph.push({
        date: games[g].date,
        players: computeRankingFromGames(games.slice(g, table.statsGameNumber)),
      });
    }
  }
  return reverseGames(graph);
}

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
