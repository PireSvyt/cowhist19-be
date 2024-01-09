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
  let stats = {};
  let graph = [];
  let players = {};

  // Sort games
  games.sort(function (first, second) {
    return first.date - second.date;
  });

  // Summarize game outcomes per user
  games.forEach((game) => {
    game.contracts.forEach((contract) => {
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
            if (!Object.keys(players).includes(player.userid)) {
              players[player.userid] = {
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
                players[player.userid].attackLoss += 1;
                players[player.userid].cumulatedPoints += contractPoints.attack;
              }
              if (player.role === "defense") {
                players[player.userid].defenseWins += 1;
                players[player.userid].cumulatedPoints +=
                  contractPoints.defense;
              }
            } else {
              if (player.role === "attack") {
                players[player.userid].attackWins += 1;
                players[player.userid].cumulatedPoints += contractPoints.attack;
              }
              if (player.role === "defense") {
                players[player.userid].defenseLoss += 1;
                players[player.userid].cumulatedPoints +=
                  contractPoints.defense;
              }
            }
          }
        });
      }
    });
    if (request.need === "graph") {
      graph.push({
        date: game.date,
        players: neaterStats(statPlayers(players), "graph", request.field),
      });
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
        neatPlayers[userid] = {};
        neatPlayers[userid].userid = player.userid;
        neatPlayers[userid].games = player.games;
        neatPlayers[userid].rateattack = player.rateattack;
        neatPlayers[userid].ratevictory = player.ratevictory;
        neatPlayers[userid].scorev0 = player.scorev0;
        neatPlayers[userid].averagepoints = player.averagepoints;
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
