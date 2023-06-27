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

  console.log("table.serviceProcessGames");

  // Initialize
  let stats = {};
  let graph = [];
  let players = {};

  // Sort games
  games.sort(function (first, second) {
    return first.date - second.date;
  });

  // Summarize game outcomes per user
  games.forEach((game) => {
    if (serviceCheckContract(game)) {
      let gamePoints = serviceGamePoints(game);
      game.players.forEach((player) => {
        // Neglect is a guest
        let nonguestplayer = true;
        if (player.nonuser !== undefined) {
          if (player.nonuser === "guest") {
            nonguestplayer = false;
          }
        }
        if (nonguestplayer) {
          // Add player to players if missing
          if (!Object.keys(players).includes(player._id)) {
            players[player._id] = {
              _id: player._id,
              attackWins: 0,
              attackLoss: 0,
              defenseWins: 0,
              defenseLoss: 0,
              cumulatedPoints: 0,
            };
          }
          // Record outcome
          if (game.outcome < 0) {
            if (player.role === "attack") {
              players[player._id].attackLoss += 1;
              players[player._id].cumulatedPoints += gamePoints.attack;
            }
            if (player.role === "defense") {
              players[player._id].defenseWins += 1;
              players[player._id].cumulatedPoints += gamePoints.defense;
            }
          } else {
            if (player.role === "attack") {
              players[player._id].attackWins += 1;
              players[player._id].cumulatedPoints += gamePoints.attack;
            }
            if (player.role === "defense") {
              players[player._id].defenseLoss += 1;
              players[player._id].cumulatedPoints += gamePoints.defense;
            }
          }
        }
      });
      if (request.need === "graph") {
        graph.push({
          date: game.date,
          players: neaterStats(statPlayers(players), "graph", request.field),
        });
      }
    }
  });

  // Ranking
  players = neaterStats(statPlayers(players), "ranking");
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

  // Additinal request
  switch (request.need) {
    case "ranking":
      // Already done
      break;
    case "graph":
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

  for (const [id, player] of Object.entries(players)) {
    // Number of games
    players[id].games =
      player.attackWins +
      player.attackLoss +
      player.defenseWins +
      player.defenseLoss;

    // Attack rate
    players[id].rateattack =
      (player.attackWins + player.attackLoss) / player.games;

    // Win rate
    players[id].ratevictory =
      (player.attackWins + player.defenseWins) / player.games;

    // Cowhist19 V0 score
    // 5+ROUND((0.75*defenseWins-0.75*defenseLoss+1.25*attackWins-1.25*attackLoss)/games*10,1)
    players[id].scorev0 =
      scorev0Offset +
      scorev0Factor *
        ((scorev0Defense * (player.defenseWins - player.defenseLoss) +
          scorev0Attack * (player.attackWins - player.attackLoss)) /
          player.games);

    // Average points
    players[id].averagepoints = player.cumulatedPoints / player.games;
  }

  return players;
}

function neaterStats(players, target, field = "averagepoints") {
  let neatPlayers = {};
  for (const [id, player] of Object.entries(players)) {
    switch (target) {
      case "ranking":
        neatPlayers[id] = {};
        neatPlayers[id]._id = player._id;
        neatPlayers[id].games = player.games;
        neatPlayers[id].rateattack = player.rateattack;
        neatPlayers[id].ratevictory = player.ratevictory;
        neatPlayers[id].scorev0 = player.scorev0;
        neatPlayers[id].averagepoints = player.averagepoints;
        break;
      case "graph":
        neatPlayers[id] = player[field];
        break;
      default:
      //
    }
  }
  return neatPlayers;
}
