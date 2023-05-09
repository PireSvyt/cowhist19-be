const serviceCheckContract = require("./serviceCheckContract");

module.exports = function processGames(games, request) {
  /*
  
  process the game list to provide stats according to request
  
  parameters
  * games to be processed
  * request / NOT USED
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */

  console.log("table.processGames");

  // Initialize
  let stats = {};
  let players = {};

  // Summarize game outcomes per user
  games.forEach((game) => {
    if (serviceCheckContract(game)) {
      game.players.forEach((player) => {
        // Add player to players if missing
        if (!Object.keys(players).includes(player._id)) {
          players[player._id] = {
            _id: player._id,
            attackWins: 0,
            attackLoss: 0,
            defenseWins: 0,
            defenseLoss: 0,
          };
        }
        // Record outcome
        if (game.outcome < 0) {
          if (player.role === "attack") {
            players[player._id].attackLoss += 1;
          }
          if (player.role === "defense") {
            players[player._id].defenseWins += 1;
          }
        } else {
          if (player.role === "attack") {
            players[player._id].attackWins += 1;
          }
          if (player.role === "defense") {
            players[player._id].defenseLoss += 1;
          }
        }
      });
    }
  });

  // Compute a score
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
      5 +
      ((0.75 * (player.defenseWins - player.defenseLoss) +
        1.25 * (player.attackWins - player.attackLoss)) /
        player.games) *
        10;
  }

  // Make a sorted array
  let playersArray = Object.values(players);
  playersArray.sort(function (a, b) {
    // sorting field
    let f = "scorev0";
    if (a[f] > b[f]) {
      return -1;
    }
    if (a[f] < b[f]) {
      return 1;
    }
    return 0;
  });

  // Stats
  stats.ranking = playersArray;

  return stats;
};
